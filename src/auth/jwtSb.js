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

export function canAdmin(payload, resourceType, resourceName) {
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.ADMIN;
}

export function canWrite(payload, resourceType, resourceName) {
  console.log(payload);
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.WRITE;
}

export function canRead(payload, resourceType, resourceName) {
  return payload.scope[resourceType]?.[resourceName] >= payload.levels.READ;
}
