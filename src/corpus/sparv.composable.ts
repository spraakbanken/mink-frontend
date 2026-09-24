import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import type { ExportType, SparvAnalysis } from "@/api/api.types";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";
import { emptyConfig, type ConfigOptions } from "@/api/corpusConfig";
import { useAppConfig } from "@/app/useAppConfig";

/** Get Sparv info from backend */
export function useSparv() {
  const { appConfig, corpusSettings } = useAppConfig();
  const api = useApi();
  const { spin } = useSpin();

  /** Load available Sparv analyses */
  async function loadAnalyses() {
    const analyses = await spin(api.sparvAnalyses(), "sparv/analyses");
    // Require attributive annotations
    return analyses.filter((analysis) =>
      analysis.annotations.some((annotation) => annotation.includes(":")),
    );
  }

  /** Check if an analysis matches a given language */
  function matchAnalysisLanguage(
    analysis: SparvAnalysis,
    langKey: string,
  ): boolean {
    if (!analysis.languages) return true;
    return !!analysis.languages.find(
      (l) => toLangKey(l.identifier.value, l.variety) == langKey,
    );
  }

  /** Sparv export type info */
  const exportTypes = computedAsync<ExportType[]>(
    () => spin(api.sparvExports(), "exports"),
    [],
  );

  /** Languages available in Sparv */
  const languages = computedAsync(() => {
    return spin(api.sparvLanguages(), "sparv/languages");
  }, []);

  /** Languages in Sparv, formatted as options */
  const languageOptions = computed(() =>
    languages.value.map(({ code, name, variety }) => ({
      value: toLangKey(code, variety),
      label: `${name}`,
    })),
  );

  /** Sparv JSON schema */
  const schema = computedAsync(() => api.sparvSchema());

  /** Config with default values */
  async function defaultConfig(): Promise<ConfigOptions> {
    // Analyses to exclude from default selection
    const defaultDisabled = corpusSettings.analyses?.defaultDisabled || [];

    const language = appConfig.defaultLanguage;
    const analyses = await findAnalyses({ language });
    const annotations = analyses
      .filter((analysis) => !defaultDisabled.includes(analysis.id))
      .flatMap((analysis) => analysis.annotations);

    return {
      ...emptyConfig(),
      language,
      annotations,
    };
  }

  /** Load and find analyses matching given conditions */
  async function findAnalyses(
    options: {
      annotations?: string[];
      language?: string;
      variety?: string;
    } = {},
  ) {
    const { annotations, language, variety } = options;
    const analysesAll = await loadAnalyses();
    // Filter by language
    const langKey = toLangKey(
      language || appConfig.defaultLanguage || "",
      variety,
    );
    const analyses = analysesAll.filter(
      (analysis) => !langKey || matchAnalysisLanguage(analysis, langKey),
    );

    // Filter by annotation ids
    if (!annotations) return analyses;
    return analyses.filter((analysis) =>
      analysis.annotations.some((annotation) =>
        annotations.includes(annotation),
      ),
    );
  }

  return {
    exportTypes,
    languageOptions,
    schema,
    defaultConfig,
    findAnalyses,
  };
}

/** Get a string for language code and optional variety */
export const toLangKey = (code: string, variety?: string) =>
  variety ? `${code}-${variety}` : code;
