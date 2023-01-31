import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "./i18n/i18n";
import { formkit, formkitConfig } from "./formkit";
import { FontAwesomeIcon } from "./fontawesome";
import "./index.css";

const pinia = createPinia();

createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(formkit, formkitConfig)
  .component("icon", FontAwesomeIcon)
  .mount("#app");
