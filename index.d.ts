interface Window {
  // Matomo queue
  _paq?: (string | number | undefined)[][];

  // Stuff exposed in dev
  api?: import("@/api/api");
  resourceStore?: import("pinia").Store;
  util?: import("@/util");
}
declare const window: Window;

declare module "vue-matomo" {
  // See https://github.com/AmazingDreams/vue-matomo/blob/master/src/utils.js

  /**
   * The default export is the Vue plugin.
   * Usage:
   *   import matomo from "vue-matomo";
   *   app.use(matomo, {...})
   */
  export default import("vue").Plugin;

  /**
   * Inject `matomoKey` to use the Matomo object.
   * Usage:
   *   const matomo = inject<Matomo>(matomoKey);
   *   matomo?.trackEvent("Vote", "Up")
   */
  export const matomoKey: string;

  /**
   * This thing is returned when injecting `matomoKey`.
   * Extend as needed.
   * Fully described on https://developer.matomo.org/api-reference/tracking-javascript
   */
  export type Matomo = {
    trackEvent: (
      category: string,
      action: string,
      name?: string,
      value?: number,
    ) => void;
  };
}
