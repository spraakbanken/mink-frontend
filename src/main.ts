import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import i18n from "./i18n/i18n";
import { formkit, formkitConfig } from "./formkit";
import { FontAwesomeIcon } from "./fontawesome";
import matomo from "vue-matomo";
import "./index.css";

const pinia = createPinia();

const app = createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(formkit, formkitConfig)
  .component("icon", FontAwesomeIcon);

// Use the Matomo plugin only if configured in env.
if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
  app.use(matomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_ID,
    router,
  });
}

app.mount("#app");
