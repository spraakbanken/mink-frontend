import { createI18n } from "vue-i18n";
import en from "@/i18n/locales/en.yaml";
import sv from "@/i18n/locales/sv.yaml";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  // English and Swedish are available by default. More can be added by the instance plugin.
  messages: { en, sv },
});
