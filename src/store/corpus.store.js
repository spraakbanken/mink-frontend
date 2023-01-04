import { setKeys } from "@/util";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useCorpusStore = defineStore("corpus", () => {
  const corpora = reactive({});

  function setCorpusIds(corpusIds) {
    setKeys(corpora, corpusIds, {});
  }

  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  return {
    corpora,
    setCorpusIds,
    hasCorpora,
  };
});
