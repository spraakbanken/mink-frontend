import { createI18n } from "vue-i18n";
import en from "@/i18n/locales/en.yaml";
import sv from "@/i18n/locales/sv.yaml";

export default createI18n({
  legacy: false,
  globalInjection: true,
  // Prefer Swedish if it's among browser's preferred languages, even if English is ranked higher
  locale: navigator.languages.find((l) => l.split("-")[0] == "sv")
    ? "sv"
    : "en",
  fallbackLocale: ["en", "sv"],
  messages: { en, sv },
});
