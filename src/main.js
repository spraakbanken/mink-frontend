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
  .use(
    plugin,
    defaultConfig({
      config: {
        classes: {
          outer: "my-2",
          help: "text-sm py-1",
          message: "text-red-500",
          label: "font-medium",
        },
      },
    })
  )
  .component("icon", FontAwesomeIcon)
  .mount("#app");
