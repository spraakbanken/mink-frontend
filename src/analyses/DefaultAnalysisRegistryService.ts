import type { AnalysisRegistryService } from "./analyses.types";

/** Default implementation of the analysis registry service, with no analyses. */
export class DefaultAnalysisRegistryService implements AnalysisRegistryService {
  constructor() {
    console.warn("Using fallback analysis registry service.");
  }
  loadMetadata = () => Promise.resolve([]);
  getAnnotations = () => [];
  getAnalyses = () => [];
  getDefaultAnalyses = () => Promise.resolve([]);
}
