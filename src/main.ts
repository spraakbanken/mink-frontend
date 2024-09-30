import { createApp } from "vue";
import matomo from "vue-matomo";
import { createPinia } from "pinia";
import router from "@/router/router";
import App from "@/App.vue";
import i18n from "@/i18n/i18n";
import "@/index.css";

const pinia = createPinia();

const app = createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n);

// Use the Matomo plugin only if configured in env.
if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
  app.use(matomo, {
    // Url expected without trailing slash
    host: import.meta.env.VITE_MATOMO_URL.replace(/\/$/, ""),
    siteId: import.meta.env.VITE_MATOMO_ID,
    router,
  });
}

app.mount("#app");
