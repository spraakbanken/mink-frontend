import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";

const storedLocale = useStorage("locale", "en");

export default function useLocale() {
  const { locale } = useI18n();

  // Sync from storage to switcher once
  locale.value = storedLocale.value;
  // Sync from switcher to store continually
  watch(locale, () => (storedLocale.value = locale.value));

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
