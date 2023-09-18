import { pathJoin } from "@/util";

export const AUTH_BASE = import.meta.env.VITE_AUTH_URL;

export function getLoginUrl(redirectLocation = "") {
  // Prepend redirect location with Mink base url.
  redirectLocation = pathJoin(
    window.location.origin,
    import.meta.env.BASE_URL,
    redirectLocation
  );
  return AUTH_BASE + `login?redirect=${redirectLocation}`;
}

export async function checkLogin() {
  const url = import.meta.env.VITE_JWT_URL || AUTH_BASE + "jwt";
  const response = await fetch(url, { credentials: "include" });
  if (response.ok) return await response.text();
  return false;
}

export function getLogoutUrl() {
  return "https://sp.spraakbanken.gu.se/Shibboleth.sso/Logout";
}
