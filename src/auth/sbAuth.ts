/**
 * @file Common handling of the SB Auth system and its JWTs.
 */

import { jwtDecode } from "jwt-decode";
import { computed, ref } from "vue";
import { deduplicateRequest, pathJoin, progressiveTimeout } from "@/util";
import api from "@/api/api";
import type { User } from "@/store/resource.types";

const AUTH_URL: string = import.meta.env.VITE_AUTH_URL;
const AUTH_GUI_URL: string = import.meta.env.VITE_AUTH_GUI_URL;
const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
const JWT_URL: string =
  import.meta.env.VITE_JWT_URL || pathJoin(AUTH_URL, "jwt");

export type JwtSbPayload = {
  name: string;
  email: string;
  /** Token expiration time as a UNIX timestamp */
  exp: number;
  /** First level keys are resource types, second level keys are resource ids and values are permission levels */
  scope: Record<JwtSbResourceType, Record<string, number>>;
  /** Defines permission levels */
  levels: Record<JwtSbLevel, number>;
};

export type JwtSbResourceType = "corpora" | "lexica" | "metadata" | "other";
export type JwtSbLevel = "READ" | "WRITE" | "ADMIN";

export const LEVELS: Readonly<JwtSbLevel[]> = ["READ", "WRITE", "ADMIN"];

/**
 * A JWT, if fetched.
 *
 * Or:
 * - Empty string if fetched and unauthenticated.
 * - Undefined if not fetched or if cleared.
 */
export const jwt = ref<string>();

/** JWT payload object with permissions etc. */
export const payload = computed<JwtSbPayload | undefined>(() => {
  if (!jwt.value) return;
  const payload = decodeJwt(jwt.value);
  if (!assertValidPayload(payload)) {
    console.error("JWT payload not valid:", payload);
    return;
  }
  return payload;
});

/** Return the SB Auth login url, with a redirect back to the given local path. */
export function getLoginUrl(redirectLocation = "") {
  // Prepend redirect location with Mink base url.
  redirectLocation = pathJoin(
    window.location.origin,
    import.meta.env.BASE_URL,
    redirectLocation,
  );
  return pathJoin(AUTH_URL, `login?redirect=${redirectLocation}`);
}

/** Checks cached JWT and updates it if needed. */
export const checkJwt = deduplicateRequest(async (skipCache?: boolean) => {
  // Check cached JWT.
  if (payload.value && !skipCache) {
    // Clear it if it's expired.
    const timeoutMs = (payload.value.exp - 10) * 1000 - Date.now();
    if (timeoutMs < 0) jwt.value = undefined;
  }

  // Fetch JWT if needed.
  if (!jwt.value || skipCache) {
    jwt.value = await fetchJwt();
    // Register JWT with API client.
    api.setJwt(jwt.value);
  }

  // Not authenticated.
  return jwt.value;
});

/**
 * Fetch JWT. Returns empty string if unauthenticated.
 */
async function fetchJwt() {
  const config = {
    url: JWT_URL,
    // With version 2, unauthenticated returns 204 instead of 401
    params: { version: 2 },
    withCredentials: true,
  };
  const options = { timeoutInit: 2000 };
  const response = await progressiveTimeout<string>(config, options);
  return response.data;
}

/** SB Auth logout url. */
export const logoutUrl = LOGOUT_URL;

export const decodeJwt = jwtDecode<JwtSbPayload>;

function assertValidPayload(payload: unknown): payload is JwtSbPayload {
  const isValid =
    payload instanceof Object &&
    "scope" in payload &&
    payload?.scope &&
    "levels" in payload &&
    payload.levels instanceof Object &&
    LEVELS.every(
      (level) =>
        level in (payload.levels as object) &&
        (payload.levels as Record<string, unknown>)[level],
    );

  if (!isValid)
    throw new TypeError("Malformed jwt payload: " + JSON.stringify(payload));

  return true;
}

/** Get the access level of the current user to a given resource. */
export const getAccessLevel = (
  type: JwtSbResourceType,
  id: string,
): JwtSbLevel | undefined => {
  if (!payload.value) return undefined;
  const scope = payload.value.scope[type]?.[id];
  if (!scope) return undefined;
  for (const level in payload.value.levels)
    if (payload.value.levels[level as JwtSbLevel] == scope)
      return level as JwtSbLevel;
};

/** Check if current user has at least READ access to a given resource */
export const canRead = (type: JwtSbResourceType, id: string): boolean =>
  !!getAccessLevel(type, id);

/** Check if current user has at least WRITE access to a given resource */
export const canWrite = (type: JwtSbResourceType, id: string): boolean => {
  const level = getAccessLevel(type, id);
  return level == "WRITE" || level == "ADMIN";
};

/** Check if current user has ADMIN access to a given resource */
export const canAdmin = (type: JwtSbResourceType, id: string): boolean =>
  getAccessLevel(type, id) == "ADMIN";

/** Check if a resource user is the currently logged in user. */
// TODO Identify by idp+sub, not email
export const isCurrentUser = (other: User): boolean =>
  other.email == payload.value?.email;

/** Creates the URL to access management for a given resource. */
export const createAuthGuiUrl = (resourceId: string) =>
  pathJoin(AUTH_GUI_URL, `resource/${resourceId}`);
