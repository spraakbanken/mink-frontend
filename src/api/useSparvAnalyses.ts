import { computedAsync } from "@vueuse/core";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";

/** Provide Sparv analysis metadata */
export function useSparvAnalyses() {
  const api = useApi();
  const { spin } = useSpin();

  const analyses = computedAsync(
    () => spin(api.sparvAnalyses(), "sparv/analyses"),
    [],
  );

  const getAnalysesByAnnotations = (annotationIds: string[]) => {
    return (analyses.value || []).filter((analysis) =>
      analysis.annotations.some((annotation) =>
        annotationIds.includes(annotation),
      ),
    );
  };

  return {
    analyses,
    getAnalysesByAnnotations,
  };
}
