import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { setKeys } from "@/util";

export const useCorpusStore = defineStore("corpus", () => {
  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const corporaRef = useStorage("mink@230102.corpora", {});
  const corpora = reactive(corporaRef.value);

  function setCorpusIds(corpusIds) {
    setKeys(corpora, corpusIds, {});
  }

  function setCorpora(corporaNew) {
    setKeys(corpora, Object.keys(corporaNew));
    for (const id in corporaNew) {
      corpora[id] = corporaNew[id];
    }
  }

  function removeCorpus(corpusId) {
    delete corpora[corpusId];
  }

  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  return {
    corpora,
    setCorpusIds,
    setCorpora,
    removeCorpus,
    hasCorpora,
  };
});
