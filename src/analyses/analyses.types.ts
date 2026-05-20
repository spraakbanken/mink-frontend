import type { ByLang } from "@/util.types";

/** Interface for a service that provides metadata on available Sparv analyses */
export type AnalysisRegistryService = {
  /** Load metadata for all available analyses */
  loadMetadata: () => Promise<Analysis[]>;
  /** Get the default annotations to use for given analyses */
  getAnnotations: (analysisIds: AnalysisId[]) => string[];
  /** Get the analyses that suggest given annotations */
  getAnalyses: (annotations: string[]) => AnalysisId[];
  /** Get which analyses to apply by default */
  getDefaultAnalyses: () => Promise<AnalysisId[]>;
};

/** An analysis id is a string */
export type AnalysisId = string;

/** Metadata for a Sparv analysis */
export type Analysis = {
  id: AnalysisId;
  label: ByLang | string;
  summary?: ByLang | string;
  languages?: string;
  unit?: ByLang | string;
  task?: string;
};
