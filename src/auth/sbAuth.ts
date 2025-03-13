/**
 * @file Common handling of the SB Auth system and its JWTs.
 */

import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { ensureTrailingSlash, pathJoin } from "@/util";

const AUTH_URL: string = ensureTrailingSlash(import.meta.env.VITE_AUTH_URL);
const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
const JWT_URL: string = import.meta.env.VITE_JWT_URL || AUTH_URL + "jwt";

export type JwtSbPayload = {
  name: string;
  email: string;
  /** Token expiration time as a UNIX timestamp */
  exp: number;
  /** First level keys are resource types, second level keys are resource ids and values are permission levels */
  scope: Record<string, Record<string, number>>;
  /** Defines permission levels */
  levels: {
    READ: number;
    WRITE: number;
    ADMIN: number;
  };
};

/** Return the SB Auth login url, with a redirect back to the given local path. */
export function getLoginUrl(redirectLocation = "") {
  // Prepend redirect location with Mink base url.
  redirectLocation = pathJoin(
    window.location.origin,
    import.meta.env.BASE_URL,
    redirectLocation,
  );
  return AUTH_URL + `login?redirect=${redirectLocation}`;
}

/**
 * Fetch JWT.
 *
 * @throws {import("axios").AxiosError} if the HTTP response code is 500 or above.
 */
export async function fetchJwt(): Promise<string | undefined> {
  return await axios
    .get<string>(JWT_URL, { withCredentials: true, timeout: 2_000 })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      if (error.response?.status == 401) return undefined;
      else throw error;
    });
}

/** Return the SB Auth logout url. */
export function getLogoutUrl(): string {
  return LOGOUT_URL;
}

export const decodeJwt = jwtDecode<JwtSbPayload>;

function assertValidPayload(payload: unknown): payload is JwtSbPayload {
  const isValid =
    payload instanceof Object &&
    "scope" in payload &&
    payload?.scope &&
    "levels" in payload &&
    payload.levels instanceof Object &&
    ["READ", "WRITE", "ADMIN"].every(
      (level) =>
        level in (payload.levels as object) &&
        (payload.levels as Record<string, unknown>)[level],
    );

  if (!isValid)
    throw new TypeError("Malformed jwt payload: " + JSON.stringify(payload));

  return true;
}

export function hasAccess(
  payload: JwtSbPayload,
  resourceType: string,
  resourceName: string,
  level: keyof JwtSbPayload["levels"],
) {
  assertValidPayload(payload);
  return payload.scope[resourceType]?.[resourceName] >= payload.levels[level];
}
