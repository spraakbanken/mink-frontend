import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { filesize } from "filesize";
import { useStorage } from "@vueuse/core";
import { once } from "es-toolkit";
import type { Ref } from "vue";
import type { ByLang, SvEn, SweEng } from "@/util.types";

const storedLocale = useStorage<SvEn | "">("locale", "");

/** Set up locale sync */
const setupLocale = once((locale: Ref<string>) => {
  // Sync from storage once, if present
  if (storedLocale.value) {
    locale.value = storedLocale.value;
  }
  exportLocale(locale.value);

  // Then sync from switcher continually
  watch(locale, () => {
    storedLocale.value = (locale.value as SvEn) || "";
    exportLocale(locale.value);
  });
});

const exportLocale = (lang: string) =>
  document.querySelector("html")?.setAttribute("lang", lang);

/** Set up locale sync and provide helpers */
export default function useLocale() {
  const { locale } = useI18n();

  setupLocale(locale);

  // The ISO 639-3 code is used in many parts of the Språkbanken infrastructure.
  const locale3 = computed<SweEng>(() =>
    locale.value == "en" ? "eng" : "swe",
  );

  /** Translate here - picks the current language out of a strings-by-language object. */
  function th(map?: ByLang | string): string | undefined {
    if (!map) return undefined;
    if (typeof map == "string") return map;

    // Pick first language found, current language first.
    const langsOrdered: SweEng[] = [locale3.value, "eng", "swe"];
    for (const lang of langsOrdered) if (map[lang]) return map[lang];
  }

  /** Create a comparator function (for `list.sort()`) that sorts by mutilanguage labels. */
  const thCompare =
    <T>(getLabel: (item: T) => ByLang | undefined): ((a: T, b: T) => number) =>
    (a, b) => {
      const labelA = th(getLabel(a));
      const labelB = th(getLabel(b));
      // Empty label should be sorted last
      if (!labelA) return 1;
      if (!labelB) return -1;
      // Compare alphabetically
      return labelA.localeCompare(labelB, locale.value);
    };

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
    thCompare,
    filesize: myFilesize,
  };
}
