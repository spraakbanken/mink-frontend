import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { checkLogin } from "@/auth/auth";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";
import { canAdmin, decodeJwt, type JwtSbPayload } from "@/auth/jwtSb";

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

const jwt = ref<string | undefined>(undefined);

export function useAuth() {
  const router = useRouter();
  const route = useRoute();
  const { spin, pending } = useSpin();

  const isAuthenticated = computed<boolean>(() => !!jwt.value);
  const payload = computed<JwtSbPayload | undefined>(() =>
    jwt.value ? decodeJwt(jwt.value)?.payload : undefined,
  );
  const canUserAdmin = computed<boolean>(
    () => !!payload.value && canAdmin(payload.value, "other", "mink-app"),
  );
  const canUserWrite = computed(() => isAuthenticated.value);
  /** Indicates whether a jwt request is currently loading. */
  const isAuthenticating = computed(() => pending.value.includes("jwt"));

  /** If not authenticated, redirect to the login page. */
  async function requireAuthentication(callback?: () => void) {
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
      const jwtValue = (await checkLogin()) || undefined;
      // Store it to make username etc available to GUI.
      jwt.value = jwtValue;
      // Register it with the API client.
      api.setJwt(jwtValue);

      // Schedule next request shortly before expiration time.
      refreshTimer && clearTimeout(refreshTimer);
      if (payload.value && payload.value.exp) {
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
