import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { filesize } from "filesize";
import { useStorage } from "@vueuse/core";
import { isEqual, once } from "es-toolkit";
import type { Ref } from "vue";
import { formatDate, type ByLang } from "@/util";
import { useAppConfig } from "@/app/useAppConfig";

const storedLocale = useStorage<string>("locale", "");

/** Set up locale sync */
const setupLocale = once((locale: Ref<string>) => {
  // Sync from storage once, if present
  if (storedLocale.value) {
    locale.value = storedLocale.value;
  }
  exportLocale(locale.value);

  // Then sync from switcher continually
  watch(locale, () => {
    storedLocale.value = locale.value || "";
    exportLocale(locale.value);
  });
});

const exportLocale = (lang: string) =>
  document.querySelector("html")?.setAttribute("lang", lang);

/** Set up locale sync and provide helpers */
export default function useLocale() {
  const { locale, availableLocales } = useI18n();
  const { uiLanguages } = useAppConfig();

  const langKeys = Object.fromEntries(uiLanguages.map((l) => [l.id, l.key]));

  if (
    !isEqual(new Set(availableLocales), new Set(uiLanguages.map((l) => l.id)))
  ) {
    console.error(
      `Vue-i18n availableLocales (${availableLocales.join()}) does not match appConfig.ui.languages (${uiLanguages.map((l) => l.id).join()})`,
    );
  }

  setupLocale(locale);

  // The ISO 639-3 code is used with Sparv etc.
  const locale3 = computed<string>(() => langKeys[locale.value]);

  /** Translate here - picks the current language out of a strings-by-language object. */
  function th(map?: ByLang | string): string | undefined {
    if (!map) return undefined;
    if (typeof map == "string") return map;

    // Pick first language found, current language first.
    const langsOrdered = [locale3.value, ...uiLanguages.map((l) => l.key)];
    for (const lang of langsOrdered) if (map[lang]) return map[lang];
  }

  /** Create a comparator function (for `list.sort()`) that sorts by mutilanguage labels. */
  const thCompare =
    <T>(
      getLabel: (item: T) => ByLang | string | undefined,
    ): ((a: T, b: T) => number) =>
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

  const formatDateLocalized = (date: Date | string, includeTime = true) =>
    formatDate(date, locale.value, includeTime);

  /** Create a translatable string with the same value in all languages */
  const createByLang = (value: string): ByLang =>
    Object.fromEntries(uiLanguages.map((l) => [l.key, value]));

  return {
    locale,
    locale3,
    th,
    thCompare,
    filesize: myFilesize,
    formatDate: formatDateLocalized,
    createByLang,
  };
}
