import { computed } from "vue";
import { useI18n } from "vue-i18n";
import useSpin from "@/spin/spin.composable";
import { hasAccess, checkJwt, payload } from "@/auth/sbAuth";
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

export function useAuth() {
  const { spin, isPending } = useSpin();
  const { alert } = useMessenger();
  const { t } = useI18n();

  const isAuthenticated = computed<boolean>(() => !!payload.value);
  /** Indicates whether a jwt request is currently loading. */
  const isAuthenticating = computed(() => isPending("jwt"));
  const canUserAdmin = computed<boolean>(
    () =>
      !!payload.value && hasAccess(payload.value, "other", "mink-app", "ADMIN"),
  );
  const canUserWrite = computed(() => isAuthenticated.value);
  const userName = computed(() => payload.value?.name || payload.value?.email);

  /**
   * Fetch JWT, store it and use it for API client.
   *
   * @throws If the JWT request fails (auth server down?).
   */
  async function getJwt(skipCache?: boolean) {
    async function fetchAndStoreJwt() {
      // Fetch JWT.
      // When skipCache is falsy we need to call checkJwt with no args for the deduplicateRequests wrapper to work properly.
      const promise = skipCache ? checkJwt(true) : checkJwt();
      await promise.catch((error) => {
        // On error, show message and treat as not authenticated
        alert(`${t("login.fail")}: ${error?.message || error}`);
      });

      // Schedule next request shortly before expiration time.
      if (refreshTimer) clearTimeout(refreshTimer);
      if (payload.value?.exp) {
        const timeoutMs = (payload.value.exp - 10) * 1000 - Date.now();
        refreshTimer = setTimeout(getJwt, timeoutMs);
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
    canUserAdmin,
    canUserWrite,
    userName,
    getJwt,
  };
}
