import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { decodeJwt, fetchJwt, type Payload } from "@/api/sbauth";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";
import useMessenger from "@/message/messenger.composable";
import { deduplicateRequest } from "@/util";

export const useJwtStore = defineStore("jwt", () => {
  const { spin } = useSpin();
  const { t } = useI18n();
  const { alert } = useMessenger();

  /**
   * A JWT, if fetched.
   *
   * - Empty string if fetched and unauthenticated.
   * - Undefined if not fetched or if cleared.
   */
  const jwt = ref<string>();

  /** Timeout slot for refreshing on expiration. */
  let refreshTimer: NodeJS.Timeout | undefined = undefined;

  /** JWT payload object with permissions etc. */
  const payload = computed<Payload | undefined>(() => {
    if (!jwt.value) return;
    try {
      return decodeJwt(jwt.value);
    } catch (error) {
      console.error("JWT payload not valid:", jwt.value, error);
    }
    return undefined;
  });

  /** How many ms remain until shortly before current JWT expires */
  const timeout = computed(
    () => payload.value && (payload.value.exp - 30) * 1000 - Date.now(),
  );

  /** Loads JWT, caches it in the ref and registers it with the Mink API client. */
  const loadJwt = deduplicateRequest(async () => {
    // Check if cached JWT has expired.
    if ((timeout.value || 0) < 0) jwt.value = undefined;

    // Fetch JWT if needed.
    if (!jwt.value) {
      try {
        jwt.value = await spin(fetchJwt(), "jwt");

        // Register new JWT with API client.
        api.setJwt(jwt.value);

        // Schedule next request shortly before expiration time.
        clearTimeout(refreshTimer);
        if (payload.value?.exp) {
          refreshTimer = setTimeout(loadJwt, timeout.value);
        }
      } catch (error) {
        // On error, show message and treat as not authenticated
        alert(`${t("login.fail")}: ${error}`, "error");
      }
    }

    return jwt.value;
  });

  function unloadJwt() {
    jwt.value = undefined;
    api.setJwt();
  }

  return {
    payload,
    loadJwt,
    unloadJwt,
  };
});
