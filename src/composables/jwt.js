import useSpin from "@/assets/spin";
import { checkLogin } from "@/auth";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { api } from "@/assets/api";

/**
 * JWT request slot.
 *
 * Globally, we make only one JWT request at a time. A second request while the
 * first one is pending can re-use that same request promise.
 */
let jwtPromise = null;

/**
 * Timeout slot for refreshing on expiration.
 *
 * After fetching the JWT, the expiration time is read, and a timeout is set to refresh the JWT accordingly.
 */
let refreshTimer = null;

export function useJwt() {
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const { spin } = useSpin();
  const { t } = useI18n();

  const jwt = computed(() => store.state.jwt);
  const isAuthenticated = computed(() => !!jwt.value);
  const payload = computed(() =>
    jwt.value ? JSON.parse(atob(jwt.value.split(".")[1])) : undefined
  );

  /** If not authenticated, redirect to the login page. */
  async function requireAuthentication() {
    if (!jwt.value) {
      await refreshJwt();
    }
    if (!jwt.value) {
      router.push(`/login?destination=${route.fullPath}`);
    }
    return !!jwt.value;
  }

  /** Fetch JWT, store it and use it for API client. */
  async function refreshJwt() {
    async function fetchAndStoreJwt() {
      // Fetch JWT.
      const jwt = await checkLogin();
      // Store it to make username etc available to GUI.
      store.commit("setJwt", jwt);
      // Register it with the API client.
      api.setJwt(jwt);

      // Schedule next request shortly before expiration time.
      clearTimeout(refreshTimer);
      if (jwt) {
        const timeoutMs = (payload.value.exp - 10) * 1000 - Date.now();
        refreshTimer = setTimeout(refreshJwt, timeoutMs);
      }

      return jwt;
    }
    // Reuse current JWT request or make a new one.
    jwtPromise =
      jwtPromise || spin(fetchAndStoreJwt(), t("jwt.refreshing"), "jwt");
    const jwt = await jwtPromise;
    // Free the slot for subsequent refreshes.
    jwtPromise = null;
    return jwt;
  }

  return {
    jwt,
    isAuthenticated,
    payload,
    requireAuthentication,
    refreshJwt,
  };
}
