import { inject } from "vue";
import { matomoKey, type Matomo } from "vue-matomo";

/** Use this to call Matomo methods in the context of a setup function. */
export function useMatomo(): Matomo | undefined {
  // Specifying the default value avoids console warnings, even if it's just `undefined`.
  return inject<Matomo | undefined>(matomoKey, undefined);
}

/**
 * Exposes supported Matomo commands as methods, which then use `window._paq`.
 * If the queue is not loaded, nothing happens.
 */
export const MatomoProxy = new Proxy<Matomo>({} as Matomo, {
  get:
    <F extends keyof Matomo>(target: {}, prop: F) =>
    (...args: Parameters<Matomo[F]>) =>
      (window as any)._paq?.push([prop, ...args]),
});
