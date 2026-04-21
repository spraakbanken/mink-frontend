import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { useExportStore } from "./export.store";
import { pickByType } from "@/util";

export const useCorpusStore = defineStore("corpus", () => {
  const resourceStore = useResourceStore();
  const { loadResource } = resourceStore;
  const { resources } = storeToRefs(resourceStore);
  const { loadExports } = useExportStore();

  const corpora = computed<Record<string, Corpus>>(() =>
    pickByType(resources.value, isCorpus),
  );

  const hasCorpora = computed(() => !!Object.keys(corpora.value).length);

  /** Load and store info for a corpus resource. */
  async function loadCorpus(id: string, skipCache = false): Promise<Corpus> {
    const resource = await loadResource(id, skipCache);
    return resource as Corpus;
  }

  // Refresh exports when Sparv is done
  watchDeep(corpora, (corporaNew, corporaOld) => {
    Object.keys(corporaNew).forEach((id) => {
      const sparvNew = corporaNew[id]?.job?.status.sparv;
      const sparvOld = corporaOld[id]?.job?.status.sparv;
      if (sparvNew == "done" && sparvOld && sparvOld != "done") {
        loadExports("corpus", id, true);
      }
    });
  });

  return {
    corpora,
    hasCorpora,
    loadCorpus,
  };
});
