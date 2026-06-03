import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { type Payload } from "@/api/sbauth";
import { useAuth } from "@/api/useAuth";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";
import useAlert from "@/alert/alert.composable";
import { deduplicateRequest } from "@/util";

export const useJwtStore = defineStore("jwt", () => {
  const auth = useAuth();
  const api = useApi();
  const { spin } = useSpin();
  const { t } = useI18n();
  const { showAlert } = useAlert();

  /**
   * A JWT, if fetched.
   *
   * - Empty string if fetched and unauthenticated.
   * - Undefined if not fetched or if cleared.
   */
  const jwt = ref<string>();

  /** Timeout slot for refreshing on expiration. */
  let refreshTimer: number | undefined = undefined;

  /** JWT payload object with permissions etc. */
  const payload = computed<Payload | undefined>(() => {
    if (!jwt.value) return;
    try {
      return auth.decodeJwt(jwt.value);
    } catch (error) {
      console.error("JWT payload not valid:", jwt.value, error);
    }
    return undefined;
  });

  const isAuthenticated = computed<boolean>(() => !!payload.value);

  const userName = computed(
    () => payload.value?.name || payload.value?.email || payload.value?.sub,
  );

  /** How many ms remain until current JWT expires */
  const getTimeout = () =>
    payload.value ? payload.value.exp * 1000 - Date.now() : -1;

  /** Loads JWT, caches it in the ref and registers it with the Mink API client. */
  const loadJwt = deduplicateRequest(async (skipCache = false) => {
    // Unset current JWT is it is outdated
    if (getTimeout() < 0 || skipCache) jwt.value = undefined;

    // Fetch JWT if needed.
    if (!jwt.value) {
      try {
        const jwtValue = await spin(auth.fetchJwt(), "jwt");

        // Register new JWT with API client before storing it in ref, which may trigger API calls
        api.setJwt(jwtValue);
        jwt.value = jwtValue;

        if (jwtValue) {
          // Schedule next request shortly before expiration time.
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => loadJwt(true), getTimeout() - 5000);
        }
      } catch (error) {
        // On error, show message and treat as not authenticated
        showAlert(`${t("login.fail")}: ${error}`);
      }
    }

    return jwt.value;
  });

  return {
    isAuthenticated,
    payload,
    userName,
    loadJwt,
  };
});
