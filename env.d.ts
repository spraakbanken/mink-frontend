/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_AUTH_URL: string;
  readonly VITE_AUTH_GUI_URL: string;
  readonly VITE_LOGOUT_URL: string;
  readonly VITE_METADATA_URL?: string;
  readonly VITE_KORP_URL: string;
  readonly VITE_STRIX_URL: string;
  readonly VITE_NEWS_URL: string;
  readonly VITE_MATOMO_URL: string;
  readonly VITE_MATOMO_ID?: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
