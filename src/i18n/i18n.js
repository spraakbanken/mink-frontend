import { createI18n } from "vue-i18n";
import en from "./locales/en.yaml";
import sv from "./locales/sv.yaml";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    sv,
  },
});
