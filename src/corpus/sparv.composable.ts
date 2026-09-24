import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import type { ExportType, SparvAnalysis } from "@/api/api.types";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";
import { useAppConfig } from "@/app/useAppConfig";

/** Get Sparv info from backend */
export function useSparv() {
  const { corpusSettings } = useAppConfig();
  const api = useApi();
  const { spin } = useSpin();

  /** Metadata on available Sparv analyses */
  const analyses = computedAsync(
    () => spin(api.sparvAnalyses(), "sparv/analyses"),
    [],
  );

  /** Get analyses that include the specified annotations */
  const getAnalysesByAnnotations = (
    annotationIds: string[],
    /** Language to optionally filter by (since different language analyses may use the same annotation) */
    language?: string,
    variety?: string,
  ) => {
    const code = language && getLanguageCode(language, variety);
    return (analyses.value || [])
      .filter((analysis) => !code || matchAnalysisLanguage(analysis, code))
      .filter((analysis) =>
        analysis.annotations.some((annotation) =>
          annotationIds.includes(annotation),
        ),
      );
  };

  /** Get a string for language code and optional variety */
  const getLanguageCode = (code: string, variety?: string) =>
    variety ? `${code}-${variety}` : code;

  /** Check if an analysis matches a given language */
  function matchAnalysisLanguage(
    analysis: SparvAnalysis,
    code: string,
  ): boolean {
    if (!analysis.languages) return true;
    return !!analysis.languages.find(
      (l) => getLanguageCode(l.identifier.value, l.variety) == code,
    );
  }

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

  /** Load annotations to enable by default */
  async function loadDefaultAnnotations(): Promise<string[]> {
    const analyses = await api.sparvAnalyses();

    // Analyses to exclude from default selection
    const defaultDisabled = corpusSettings.analyses?.defaultDisabled || [];

    const annotations = analyses
      .filter((analysis) => !defaultDisabled.includes(analysis.id))
      .flatMap((analysis) => analysis.annotations);

    return annotations;
  }

  return {
    analyses,
    exportTypes,
    languageOptions,
    schema,
    getAnalysesByAnnotations,
    getLanguageCode,
    loadDefaultAnnotations,
    matchAnalysisLanguage,
  };
}
