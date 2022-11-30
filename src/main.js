import { createApp } from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import "./index.css";
import i18n from "./i18n/i18n";
import { FontAwesomeIcon } from "./fontawesome";

createApp(App) //
  .use(router)
  .use(store)
  .use(i18n)
  .component("icon", FontAwesomeIcon)
  .mount("#app");
