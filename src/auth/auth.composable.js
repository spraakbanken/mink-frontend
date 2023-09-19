import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import useSpin from "@/spin/spin.composable";
import { checkLogin } from "./auth";
import { api } from "@/api/api";
import { canAdmin, canWrite, decodeJwt } from "./jwtSb";

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

const jwt = ref(null);

export function useAuth() {
  const router = useRouter();
  const route = useRoute();
  const { spin, pending } = useSpin();
  const { t } = useI18n();

  const isAuthenticated = computed(() => !!jwt.value);
  const payload = computed(() => decodeJwt(jwt.value)?.payload);
  const canUserAdmin = computed(
    () => payload.value && canAdmin(payload.value, "other", "mink-app")
  );
  const canUserWrite = computed(
    () => payload.value && canWrite(payload.value, "other", "mink-app")
  );
  /** Indicates whether a jwt request is currently loading. */
  const isAuthenticating = computed(() => pending.value.includes("jwt"));

  /** If not authenticated, redirect to the login page. */
  async function requireAuthentication(callback) {
    // First, ensure the jwt has been fetched.
    if (!jwt.value) {
      await refreshJwt();
    }
    // If still no jwt, it means the user hasn't authenticated. Show our login page.
    if (!jwt.value) {
      // By passing current page as destination param, the user will then be redirected back to where they first attempted to go.
      router.push(`/login?destination=${route.fullPath}`);
      return;
    }
    // When calling `requireAuthentication`, you can optionally specify what should happen upon success.
    callback?.();
  }

  /** Fetch JWT, store it and use it for API client. */
  async function refreshJwt() {
    async function fetchAndStoreJwt() {
      // Fetch JWT.
      const jwtValue = await checkLogin();
      // Store it to make username etc available to GUI.
      jwt.value = jwtValue;
      // Register it with the API client.
      api.setJwt(jwtValue);

      // Schedule next request shortly before expiration time.
      clearTimeout(refreshTimer);
      if (payload.value && payload.value.exp) {
        const timeoutMs = (payload.value.exp - 10) * 1000 - Date.now();
        refreshTimer = setTimeout(refreshJwt, timeoutMs);
      }
    }
    // Reuse current JWT request or make a new one.
    jwtPromise =
      jwtPromise || spin(fetchAndStoreJwt(), t("jwt.refreshing"), "jwt");
    await jwtPromise;
    // Free the slot for subsequent refreshes.
    jwtPromise = null;
  }

  return {
    isAuthenticating,
    isAuthenticated,
    payload,
    canUserAdmin,
    canUserWrite,
    requireAuthentication,
    refreshJwt,
  };
}
