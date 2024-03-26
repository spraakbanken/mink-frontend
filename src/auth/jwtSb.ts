/**
 * @file Common handling of JWTs from the SB Auth system.
 */

export type JwtSb = {
  header: any;
  payload: JwtSbPayload;
};

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

export function decodeJwt(jwt: string): JwtSb | undefined {
  if (!jwt) return undefined;
  const parts = jwt.split(".");
  if (parts.length != 3) {
    throw new RangeError(`Not a JWT: "${jwt}"`);
  }

  return {
    header: JSON.parse(atob(parts[0])),
    payload: JSON.parse(atob(parts[1])),
  };
}

export function assertValidPayload(payload: any): payload is JwtSbPayload {
  const isValid =
    payload?.scope &&
    payload.levels &&
    payload.levels.ADMIN &&
    payload.levels.WRITE &&
    payload.levels.READ;

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
