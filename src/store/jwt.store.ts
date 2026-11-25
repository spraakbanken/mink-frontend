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

  /** JWT payload object with permissions etc. */
  const payload = ref<Payload>();

  const isAuthenticated = computed<boolean>(() => !!payload.value);

  const userName = computed(
    () => payload.value?.name || payload.value?.email || payload.value?.sub,
  );

  /** How many ms remain until current JWT expires */
  const getTimeout = () =>
    payload.value ? payload.value.exp * 1000 - Date.now() : 10000;

  /** Loads JWT, caches it in the ref and registers it with the Mink API client. */
  const loadJwt = deduplicateRequest(async (skipCache = false) => {
    // Unset current JWT if it is outdated
    if (getTimeout() < 0 || skipCache) jwt.value = undefined;

    // Fetch JWT if needed.
    if (!jwt.value) {
      try {
        const jwtValue = await spin(auth.fetchJwt(), "jwt");

        // Decoding throws if the token is invalid,
        // so after this we know it's either valid or empty.
        payload.value = jwtValue ? auth.decodeJwt(jwtValue) : undefined;

        // Register new JWT with API client (or clear if empty)
        // before storing it in ref, which may trigger API calls
        api.setJwt(jwtValue);
        jwt.value = jwtValue;
      } catch (error) {
        // On error, show message and treat as not authenticated
        showAlert(`${t("login.fail")}: ${error}`);
      }
    }

    return jwt.value;
  });

  // If the JWT is about to expire, refresh it.
  setInterval(() => {
    if (getTimeout() < 10000) loadJwt(true);
  }, 5000);

  return {
    isAuthenticated,
    payload,
    userName,
    loadJwt,
  };
});
