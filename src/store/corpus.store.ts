import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { setKeys } from "@/util";
import type { ByLang } from "@/util.types";
import type { CorpusStatus, FileMeta, ResourceInfo } from "@/api/api.types";
import type { ConfigOptions } from "@/api/corpusConfig";

type Corpus = {
  name: ByLang;
  sources: FileMeta[];
  config: ConfigOptions;
  status: CorpusStatus;
  exports: FileMeta[];
};

export const useCorpusStore = defineStore("corpus", () => {
  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const corporaRef = useStorage("mink@230102.corpora", {});
  const corpora: Record<string, Partial<Corpus>> = reactive(corporaRef.value);

  function setCorpusIds(corpusIds: string[]) {
    setKeys(corpora, corpusIds, {});
  }

  function setCorpora(infos: ResourceInfo[]) {
    // Drop old keys, assign empty records for each new id
    const ids = infos.map((info) => info.resource.id);
    setKeys(corpora, ids, {});

    for (const infoNew of infos) {
      // Patch any existing record, otherwise create a new one.
      const info =
        infoNew.resource.id in corpora ? corpora[infoNew.resource.id] : {};
      info.name = infoNew.resource.name;
      info.sources = infoNew.resource.source_files;
      info.status = infoNew.job;
      corpora[infoNew.resource.id] = info;
    }
  }

  function removeCorpus(corpusId: string) {
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
