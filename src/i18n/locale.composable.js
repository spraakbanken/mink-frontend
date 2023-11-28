import { computed, inject, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import { filesize } from "filesize";

const storedLocale = useStorage("locale", "");

export default function useLocale() {
  const { locale } = useI18n();
  const formkitConfig = inject(Symbol.for("FormKitConfig"));

  const exportLocale = () => {
    formkitConfig.locale = locale.value;
    document.querySelector("html")?.setAttribute("lang", locale.value);
  };

  // The ISO 639-3 code is used in many parts of the Språkbanken infrastructure.
  const locale3 = computed(() => (locale.value == "en" ? "eng" : "swe"));

  // Sync from storage once, if present
  if (storedLocale.value) {
    locale.value = storedLocale.value;
  }
  exportLocale();

  // Then sync from switcher continually
  watch(locale, () => {
    storedLocale.value = locale.value;
    exportLocale();
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

  /** Wrap the filesize lib with some sane defaults and avoiding exponential notation. */
  function myFilesize(bytes, precision = 2) {
    // Default precision is 0 which means up until 2 decimals?
    const str = filesize(bytes, { precision, base: 2, locale: locale.value });
    // Convert exponential notation to ordinary.
    return str.replace(/[\d.]+e[+\d]+/, parseFloat);
  }

  return {
    locale,
    locale3,
    th,
    filesize: myFilesize,
  };
}
