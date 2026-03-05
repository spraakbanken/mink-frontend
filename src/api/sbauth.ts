import { jwtDecode } from "jwt-decode";
import { invert } from "es-toolkit";
import { pathJoin } from "@/util";

export type Payload = {
  name: string;
  email: string;
  /** Token expiration time as a UNIX timestamp */
  exp: number;
  /** Identity provider */
  idp: string;
  /** Subject (user identifier) */
  sub: string;
  /** First level keys are resource types, second level keys are resource ids and values are permission levels */
  scope: Record<ResourceType, Record<string, number>>;
  /** Defines permission levels */
  levels: Record<Level, number>;
};

export type ResourceType = "corpora" | "lexica" | "metadata" | "other";

export type Level = "READ" | "WRITE" | "ADMIN";

/** All levels in ascending order */
export const levels: Level[] = ["READ", "WRITE", "ADMIN"];

const AUTH_URL: string =
  import.meta.env.VITE_AUTH_URL || "https://sp.spraakbanken.gu.se/auth/";
const AUTH_GUI_URL: string =
  import.meta.env.VITE_AUTH_GUI_URL || "https://spraakbanken.gu.se/auth/";
const LOGOUT_URL: string =
  import.meta.env.VITE_LOGOUT_URL ||
  "https://sp.spraakbanken.gu.se/Shibboleth.sso/Logout";

/**
 * Fetch JWT. Returns empty string if unauthenticated.
 */
export async function fetchJwt(): Promise<string> {
  const url = pathJoin(AUTH_URL, "jwt?version=2");
  const response = await fetch(url, { credentials: "include" });
  return await response.text();
}

export const decodeJwt = (token: string): Payload => jwtDecode<Payload>(token);

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

export const getLogoutUrl = () => LOGOUT_URL;

/** Creates the URL to access management for a given resource. */
export const getAuthGuiUrl = (resourceId: string) =>
  pathJoin(AUTH_GUI_URL, `resource/${resourceId}`);

/** Find the access level to a given resource in a JWT payload */
export const getAccess = (
  payload: Payload | undefined,
  type: ResourceType,
  id: string,
): Level | undefined => {
  const scope = payload?.scope[type]?.[id];
  if (!scope) return undefined;
  const scopes = invert(payload.levels);
  return scopes[scope];
};

/** Check if a JWT payload has *at least* the given access level to a resource */
export const hasAccessLevel = (
  payload: Payload | undefined,
  type: ResourceType,
  id: string,
  level: Level,
): boolean =>
  levels.indexOf(getAccess(payload, type, id)!) >= levels.indexOf(level);
