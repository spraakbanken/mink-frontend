import { createI18n } from "vue-i18n";
import en from "./locales/en";
import sv from "./locales/sv";

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
