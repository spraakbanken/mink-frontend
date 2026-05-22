import { createI18n } from "vue-i18n";
import en from "@/i18n/locales/en.yaml";
import sv from "@/i18n/locales/sv.yaml";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: ["en", "sv"],
  messages: { en, sv },
});

/** Each UI language name, written in that language, keyed by its 2-letter locale id. */
export const languageNames: Record<string, string> = {
  en: "English",
  sv: "Svenska",
};
