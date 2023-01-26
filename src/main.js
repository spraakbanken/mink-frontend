import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "./i18n/i18n";
import { defaultConfig, plugin } from "@formkit/vue";
import { FontAwesomeIcon } from "./fontawesome";
import "./index.css";

const pinia = createPinia();

createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(plugin, defaultConfig)
  .component("icon", FontAwesomeIcon)
  .mount("#app");
