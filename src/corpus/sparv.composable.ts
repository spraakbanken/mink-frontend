import { computedAsync } from "@vueuse/core";
import { compact, uniqBy } from "es-toolkit";
import type { ExportType, SparvAnalysis } from "@/api/api.types";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";
import { emptyConfig, type ConfigOptions } from "@/api/corpusConfig";
import { useAppConfig } from "@/app/useAppConfig";
import { fromKeys } from "@/util";
import useLocale from "@/i18n/locale.composable";

/** Get Sparv info from backend */
export function useSparv() {
  const { appConfig } = useAppConfig();
  const api = useApi();
  const { spin } = useSpin();
  const { th, thCompare } = useLocale();

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

  async function loadExporters(language: string) {
    return api.sparvExports(language);
  }

  /** Languages of available analyses, formatted as options */
  const languageOptions = computedAsync(async () => {
    const analyses = await loadAnalyses();
    const languages = analyses.flatMap((analysis) => analysis.languages);
    const options = compact(languages).map((l) => ({
      value: toLangKey(l.identifier.value, l.variety),
      label: th(l.name) || l.identifier.value,
    }));
    return uniqBy(options, (o) => o.value).sort(thCompare((o) => o.label));
  }, []);

  /** Sparv JSON schema */
  const schema = computedAsync(() => api.sparvSchema());

  /** Config with default values */
  async function defaultConfig(): Promise<ConfigOptions> {
    const language = appConfig.defaultLanguage;
    const analyses = await findAnalyses({ language });
    const annotations = analyses
      .filter((analysis) => analysis.enabled_by_default)
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

  /** Group analyses by unit */
  function groupAnalyses(analyses: SparvAnalysis[]) {
    // List of recognized units
    const units = ["text", "sentence", "token", "other"];

    return fromKeys(units, (unit) =>
      analyses.filter((analysis) => {
        // Match unit
        const unitRaw = analysis.analysis_unit?.eng || "";
        const thisUnit = units.includes(unitRaw) ? unitRaw : "other";
        return thisUnit == unit;
      }),
    );
  }

  return {
    exportTypes,
    languageOptions,
    schema,
    defaultConfig,
    findAnalyses,
    groupAnalyses,
    loadExporters,
  };
}

/** Get a string for language code and optional variety */
export const toLangKey = (code: string, variety?: string) =>
  variety ? `${code}-${variety}` : code;
