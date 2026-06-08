import { jwtDecode } from "jwt-decode";
import { invert } from "es-toolkit";
import { getBaseUrl, pathJoin } from "@/util";

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

export class SbAuthService {
  constructor(
    /** Url to SB-Auth */
    protected apiUrl: string,
    /** SB-Auth logout url */
    protected logoutUrl: string,
    /** Url to SB-Auth GUI */
    protected guiUrl?: string,
  ) {}

  /**
   * Fetch JWT. Returns empty string if unauthenticated.
   */
  async fetchJwt(): Promise<string> {
    const url = pathJoin(this.apiUrl, "jwt?version=2");
    const response = await fetch(url, { credentials: "include" });
    return await response.text();
  }

  decodeJwt = (token: string): Payload => jwtDecode<Payload>(token);

  /** Return the SB Auth login url, with a redirect back to the given local path. */
  getLoginUrl(redirectLocation = "") {
    // Prepend redirect location with Mink base url.
    redirectLocation = pathJoin(getBaseUrl(), redirectLocation);
    return pathJoin(this.apiUrl, `login?redirect=${redirectLocation}`);
  }

  getLogoutUrl() {
    return this.logoutUrl;
  }

  /** Creates the URL to access management for a given resource. */
  getGuiUrl(resourceId: string) {
    return this.guiUrl ? pathJoin(this.guiUrl, `resource/${resourceId}`) : null;
  }

  /** Find the access level to a given resource in a JWT payload */
  getAccess(
    payload: Payload | undefined,
    type: ResourceType,
    id: string,
  ): Level | undefined {
    const scope = payload?.scope[type]?.[id];
    if (!scope) return undefined;
    const scopes = invert(payload.levels);
    return scopes[scope];
  }

  /** Check if a JWT payload has *at least* the given access level to a resource */
  hasAccessLevel(
    payload: Payload | undefined,
    type: ResourceType,
    id: string,
    level: Level,
  ): boolean {
    return (
      levels.indexOf(this.getAccess(payload, type, id)!) >=
      levels.indexOf(level)
    );
  }
}
