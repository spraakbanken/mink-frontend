import { computedAsync } from "@vueuse/core";
import { useResourceStore } from "@/store/resource.store";

export function useLexicon(id: string) {
  const { loadResource } = useResourceStore();

  const lexicon = computedAsync(() => loadResource(id));

  return {
    lexicon,
  };
}
