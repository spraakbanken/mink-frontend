import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./index.css";
import i18n from "./i18n/i18n";
import { FontAwesomeIcon } from "./fontawesome";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n)
  .component("icon", FontAwesomeIcon)
  .mount("#app");
