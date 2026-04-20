import { computedAsync } from "@vueuse/core";
import { useResourceStore } from "@/store/resource.store";
import { useExportStore } from "@/store/export.store";

export function useLexicon(id: string) {
  const { loadTypedResource } = useResourceStore();
  const { loadExports } = useExportStore();

  const lexicon = computedAsync(() => loadTypedResource("lexicon", id));

  const exports = computedAsync(() => loadExports("lexicon", id), undefined, {
    lazy: true,
  });

  return {
    lexicon,
    exports,
  };
}
