import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { retry } from "@/util";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";
import {
  fetchJwt,
  hasAccess,
  decodeJwt,
  type JwtSbPayload,
} from "@/auth/sbAuth";
import useMessenger from "@/message/messenger.composable";

/**
 * JWT request slot.
 *
 * Globally, we make only one JWT request at a time. A second request while the
 * first one is pending can re-use that same request promise.
 */
let jwtPromise: Promise<unknown> | undefined = undefined;

/**
 * Timeout slot for refreshing on expiration.
 *
 * After fetching the JWT, the expiration time is read, and a timeout is set to refresh the JWT accordingly.
 */
let refreshTimer: NodeJS.Timeout | undefined = undefined;

const payload = ref<JwtSbPayload>();

export function useAuth() {
  const router = useRouter();
  const route = useRoute();
  const { spin, isPending } = useSpin();
  const { alert } = useMessenger();
  const { t } = useI18n();

  const isAuthenticated = computed<boolean>(() => !!payload.value);
  const canUserAdmin = computed<boolean>(
    () =>
      !!payload.value && hasAccess(payload.value, "other", "mink-app", "ADMIN"),
  );
  const canUserWrite = computed(() => isAuthenticated.value);
  /** Indicates whether a jwt request is currently loading. */
  const isAuthenticating = computed(() => isPending("jwt"));

  /** If not authenticated, redirect to the login page. */
  async function requireAuthentication(callback?: () => void) {
    // First, ensure the jwt has been fetched.
    if (!payload.value) {
      await refreshJwt();
    }
    // If still no jwt, it means the user hasn't authenticated. Show our login page.
    if (!payload.value) {
      // By passing current page as destination param, the user will then be redirected back to where they first attempted to go.
      router.push(`/login?destination=${route.fullPath}`);
      return;
    }
    // When calling `requireAuthentication`, you can optionally specify what should happen upon success.
    callback?.();
  }

  /**
   * Fetch JWT, store it and use it for API client.
   *
   * @throws If the JWT request fails (auth server down?).
   */
  async function refreshJwt() {
    async function fetchAndStoreJwt() {
      // Fetch JWT. Occasionally it times out, so try a few times before giving up.
      const jwtValue = await retry(fetchJwt).catch((error) => {
        // On error, show message and treat as not authenticated
        alert(`${t("login.fail")}: ${error?.message || error}`);
        return undefined;
      });
      // Store it to make username etc available to GUI.
      payload.value = jwtValue ? decodeJwt(jwtValue)?.payload : undefined;
      // Register it with the API client.
      api.setJwt(jwtValue);

      // Schedule next request shortly before expiration time.
      if (refreshTimer) clearTimeout(refreshTimer);
      if (payload.value?.exp) {
        const timeoutMs = (payload.value.exp - 10) * 1000 - Date.now();
        refreshTimer = setTimeout(refreshJwt, timeoutMs);
      }
    }
    // Reuse current JWT request or make a new one.
    jwtPromise = jwtPromise || spin(fetchAndStoreJwt(), "jwt");
    await jwtPromise;
    // Free the slot for subsequent refreshes.
    jwtPromise = undefined;
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
