import { inject } from "vue";
import { DefaultAnalysisRegistryService } from "./DefaultAnalysisRegistryService";
import type { AnalysisRegistryService } from "./analyses.types";
import { injectionKeys } from "@/injection";

/** Global instance of the service */
let service: AnalysisRegistryService | undefined;

/** Provide the analysis registry service */
export function useAnalysisRegistry() {
  if (!service)
    service =
      inject(injectionKeys.service.analysisRegistry, undefined) ||
      new DefaultAnalysisRegistryService();

  return service;
}
