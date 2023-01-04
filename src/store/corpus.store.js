import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCorpusStore = defineStore("corpus", () => {
  // TODO Try reactive()
  const corpora = ref({});

  function setCorpusIds(corpusIds) {
    // Add empty data objects for any new ids. Keep data for existing ids.
    corpusIds.forEach(
      (corpusId) => (corpora.value[corpusId] = corpora.value[corpusId] || {})
    );
    // Remove data where ids do not match.
    Object.keys(corpora.value).forEach(
      (corpusId) =>
        corpusIds.includes(corpusId) || delete corpora.value[corpusId]
    );
  }

  const hasCorpora = computed(() => !!Object.keys(corpora.value).length);

  function getCorpus(id) {
    return corpora.value[id];
  }

  function getCorpusComputed(id) {
    return computed(() => corpora.value[id]);
  }

  return {
    corpora,
    setCorpusIds,
    hasCorpora,
    getCorpus,
    getCorpusComputed,
  };
});
