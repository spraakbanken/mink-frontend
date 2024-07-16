import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { filesize } from "filesize";
import { useStorage } from "@vueuse/core";
import type { ByLang, SvEn, SweEng } from "@/util.types";

const storedLocale = useStorage<SvEn | "">("locale", "");

export default function useLocale() {
  const { locale } = useI18n();

  const exportLocale = () => {
    document.querySelector("html")?.setAttribute("lang", locale.value);
  };

  // The ISO 639-3 code is used in many parts of the Språkbanken infrastructure.
  const locale3 = computed<SweEng>(() =>
    locale.value == "en" ? "eng" : "swe",
  );

  // Sync from storage once, if present
  if (storedLocale.value) {
    locale.value = storedLocale.value;
  }
  exportLocale();

  // Then sync from switcher continually
  watch(locale, () => {
    storedLocale.value = (locale.value as SvEn) || "";
    exportLocale();
  });

  /** Translate here - picks the current language out of a strings-by-language object. */
  function th(map?: ByLang | string): string | undefined {
    if (!map) return undefined;
    if (typeof map == "string") return map;
    return map[locale3.value];
  }

  /** Wrap the filesize lib with some sane defaults and avoiding exponential notation. */
  function myFilesize(bytes: number, precision = 2) {
    // Default precision is 0 which means up until 2 decimals?
    const str = filesize(bytes, { precision, base: 2, locale: locale.value });
    // Convert exponential notation to ordinary.
    return str.replace(/[\d.]+e[+\d]+/, (numStr) => String(parseFloat(numStr)));
  }

  return {
    locale,
    locale3,
    th,
    filesize: myFilesize,
  };
}
