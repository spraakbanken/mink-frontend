import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { setKeys } from "@/util";

export const useCorpusStore = defineStore("corpus", () => {
  const corporaRef = useStorage("corpora", {});
  const corpora = reactive(corporaRef.value);

  function setCorpusIds(corpusIds) {
    setKeys(corpora, corpusIds, {});
  }

  function removeCorpus(corpusId) {
    delete corpora[corpusId];
  }

  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  return {
    corpora,
    setCorpusIds,
    removeCorpus,
    hasCorpora,
  };
});
