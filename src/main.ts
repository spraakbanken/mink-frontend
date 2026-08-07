import { createApp } from "vue";
import { createPinia } from "pinia";
import createInstancePlugin from "@instance/plugin";
import codemirror from "vue-codemirror";
import { minimalSetup } from "codemirror";
import router from "@/router/router";
import App from "@/App.vue";
import i18n from "@/i18n/i18n";
import { matomo } from "@/matomo";
import "@/index.css";
import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/jost";

const pinia = createPinia();

const app = createApp(App) //
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(matomo)
  // CodeMirror extensions cannot be disabled, so replace the default basic set here
  // and add the desired ones in the `MinkCodemirror` component instead
  .use(codemirror, { extensions: [minimalSetup] })
  .use(createInstancePlugin());

app.mount("#app");
