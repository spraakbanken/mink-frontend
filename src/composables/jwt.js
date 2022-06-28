import useSpin from "@/assets/spin";
import { checkLogin } from "@/auth";
import { sleep } from "@/util";
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
  }

  /** Fetch JWT, store it and use it for API client. */
  async function refreshJwt(patiently = false) {
    async function fetchAndStoreJwt() {
      if (patiently) await sleep(2000);
      // Fetch JWT.
      const jwt = await checkLogin();
      // Store it to make username etc available to GUI.
      store.commit("setJwt", jwt);
      // Register it with the API client.
      api.setJwt(jwt);
      await sleep(100);
      // Free the slot for subsequent refreshes.
      return jwt;
    }
    // Reuse current JWT request or make a new one.
    jwtPromise =
      jwtPromise || spin(fetchAndStoreJwt(), t("jwt.refreshing"), "jwt");
    const jwt = await jwtPromise;
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
