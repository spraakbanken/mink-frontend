import { setKeys } from "@/util";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCorpusStore = defineStore("corpus", () => {
  // TODO Try reactive()
  const corpora = ref({});

  function setCorpusIds(corpusIds) {
    corpora.value = setKeys(corpora.value, corpusIds, {});
  }

  const hasCorpora = computed(() => !!Object.keys(corpora.value).length);

  function getCorpus(id) {
    return computed(() => corpora.value[id]);
  }

  return {
    corpora,
    setCorpusIds,
    hasCorpora,
    getCorpus,
  };
});
