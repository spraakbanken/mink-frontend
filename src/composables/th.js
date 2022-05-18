import { useI18n } from "vue-i18n";

export default function useTh() {
  const { locale } = useI18n();

  /** Translate here - picks the current language out of a strings-by-language object. */
  function th(stringsByLang) {
    if (!stringsByLang) return undefined;
    const lang3 = { sv: "swe", en: "eng" }[locale.value];
    return stringsByLang[locale.value] || stringsByLang[lang3];
  }

  return { locale, th };
}
