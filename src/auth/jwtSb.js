/**
 * @file Common handling of JWTs from the SB Auth system.
 */

export function decodeJwt(jwt) {
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

export function assertValidPayload(payload) {
  const isValid =
    payload &&
    payload.scope &&
    payload.levels &&
    payload.levels.ADMIN &&
    payload.levels.WRITE &&
    payload.levels.READ;

  if (!isValid) {
    throw new TypeError("Malformed jwt payload: " + JSON.stringify(payload));
  }
}

export function canAdmin(payload, resourceType, resourceName) {
  assertValidPayload(payload);
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.ADMIN;
}

export function canWrite(payload, resourceType, resourceName) {
  assertValidPayload(payload);
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.WRITE;
}

export function canRead(payload, resourceType, resourceName) {
  assertValidPayload(payload);
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.READ;
}
