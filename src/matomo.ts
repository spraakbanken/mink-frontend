/** @file Adaptations of the vue3-matomo plugin */
import { type App } from "vue";
import { createVueMatomo } from "vue3-matomo";
import router from "./router/router";

/** Vue plugin that wraps the original Matomo plugin but only enables it if configured */
export const matomo = {
  install(app: App) {
    const { VITE_MATOMO_URL, VITE_MATOMO_ID } = import.meta.env;
    if (VITE_MATOMO_URL && VITE_MATOMO_ID) {
      app.use(
        createVueMatomo({
          // Url expected without trailing slash
          host: VITE_MATOMO_URL.replace(/\/$/, ""),
          siteId: VITE_MATOMO_ID,
          router,
        }),
      );
    }
  },
};
