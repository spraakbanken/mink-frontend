import { inject, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";

const storedLocale = useStorage("locale", "en");

export default function useLocale() {
  const { locale } = useI18n();
  const formkitConfig = inject(Symbol.for("FormKitConfig"));

  // Sync from storage once
  locale.value = storedLocale.value;
  formkitConfig.locale = storedLocale.value;

  // Then sync from switcher continually
  watch(locale, () => {
    storedLocale.value = locale.value;
    formkitConfig.locale = locale.value;
  });

  /** Translate here - picks the current language out of a strings-by-language object. */
  function th(stringsByLang) {
    if (!stringsByLang) return undefined;
    if (typeof stringsByLang == "string") return stringsByLang;
    const lang3 = { sv: "swe", en: "eng" }[locale.value];
    return (
      stringsByLang[locale.value] ||
      stringsByLang[lang3] ||
      stringsByLang.eng ||
      stringsByLang.swe ||
      Object.values(stringsByLang)[0]
    );
  }

  return { locale, th };
}
