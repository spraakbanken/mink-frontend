declare module "*.yaml" {
  const value: Record<string, unknown>;
  export default value;
}

// Specify type of locale files as strings
declare module "@/i18n/locales/*.yaml" {
  const value: Record<string, string>;
  export default value;
}

interface Window {
  // Matomo queue
  _paq?: (string | number | undefined)[][];

  // Stuff exposed in dev
  api?: import("@/api/api");
  resourceStore?: import("pinia").Store;
  util?: import("@/util");
}
declare const window: Window;
