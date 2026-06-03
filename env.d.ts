/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MATOMO_URL: string;
  readonly VITE_MATOMO_ID?: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
