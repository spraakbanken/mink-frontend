import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import type { ExportType } from "@/api/api.types";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";

/** Get Sparv info from backend */
export function useSparv() {
  const api = useApi();
  const { spin } = useSpin();

  /** Metadata on available Sparv analyses */
  const analyses = computedAsync(
    () => spin(api.sparvAnalyses(), "sparv/analyses"),
    [],
  );

  /** Get analyses that include the specified annotations */
  const getAnalysesByAnnotations = (annotationIds: string[]) => {
    return (analyses.value || []).filter((analysis) =>
      analysis.annotations.some((annotation) =>
        annotationIds.includes(annotation),
      ),
    );
  };

  /** Get a string for language code and optional variety */
  const getLanguageCode = (code: string, variety?: string) =>
    variety ? `${code}-${variety}` : code;

  /** Sparv export type info */
  const exportTypes = computedAsync<ExportType[]>(
    () => spin(api.sparvExports(), "exports"),
    [],
  );

  /** Languages available in Sparv */
  const languages = computedAsync(
    () => spin(api.sparvLanguages(), "sparv/languages"),
    [],
  );

  /** Languages in Sparv, formatted as options */
  const languageOptions = computed(() =>
    languages.value.map(({ code, name, variety }) => ({
      value: getLanguageCode(code, variety),
      label: `${name}`,
    })),
  );

  /** Sparv JSON schema */
  const schema = computedAsync(() => api.sparvSchema());

  return {
    analyses,
    exportTypes,
    languageOptions,
    schema,
    getAnalysesByAnnotations,
    getLanguageCode,
  };
}
