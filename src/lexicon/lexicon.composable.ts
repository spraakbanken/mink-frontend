import { computedAsync } from "@vueuse/core";
import { useResourceStore } from "@/store/resource.store";
import { useExportStore } from "@/store/export.store";

export function useLexicon(id: string) {
  const { loadResource } = useResourceStore();
  const { loadExports } = useExportStore();

  const lexicon = computedAsync(() => loadResource(id));

  const exports = computedAsync(() => loadExports(id), undefined, {
    lazy: true,
  });

  return {
    lexicon,
    exports,
  };
}
