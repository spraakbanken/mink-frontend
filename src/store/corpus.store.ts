import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { setKeys } from "@/util";
import type { ByLang } from "@/util.types";
import type {
  CorpusStatus,
  FileMeta,
  ResourceInfo,
  ResourceType,
} from "@/api/api.types";
import type { ConfigOptions } from "@/api/corpusConfig";

type Resource = {
  type: ResourceType;
  name: ByLang;
};

type Corpus = Resource & {
  type: "corpus";
  sources: FileMeta[];
  config: ConfigOptions;
  status: CorpusStatus;
  exports: FileMeta[];
};

type Metadata = Resource;

// A user-defined type guard to help inform TypeScript
// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
const isCorpus = (resource: Partial<Resource>): resource is Corpus =>
  resource.type == "corpus";

export const useCorpusStore = defineStore("corpus", () => {
  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const corporaRef = useStorage("mink@230102.corpora", {});
  const resources: Record<string, Partial<Resource>> = reactive(
    corporaRef.value,
  );

  const corpora = computed<Record<string, Partial<Corpus>>>(() =>
    filterResources("corpus"),
  );
  const metadatas = computed<Record<string, Partial<Metadata>>>(() =>
    filterResources("metadata"),
  );

  const filterResources = <T extends Resource>(
    type: ResourceType,
  ): Record<string, Partial<T>> =>
    Object.keys(resources).reduce(
      (corpora, resourceId) =>
        resources[resourceId].type == type
          ? { ...corpora, [resourceId]: resources[resourceId] }
          : corpora,
      {},
    );

  function setCorpusIds(resourceIds: string[]) {
    setKeys(resources, resourceIds, {});
  }

  function setCorpora(infos: ResourceInfo[]) {
    // Drop old keys, assign empty records for each new id
    const ids = infos.map((info) => info.resource.id);
    setKeys(resources, ids, {});

    for (const infoNew of infos) {
      // Patch any existing record, otherwise create a new one.
      const info =
        infoNew.resource.id in corpora.value
          ? resources[infoNew.resource.id]
          : {};
      info.type = infoNew.resource.type;
      info.name = infoNew.resource.name;

      if (isCorpus(info)) {
        info.sources = infoNew.resource.source_files;
        info.status = infoNew.job;
      }

      resources[infoNew.resource.id] = info;
    }
  }

  function removeCorpus(corpusId: string) {
    delete resources[corpusId];
  }

  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  return {
    resources,
    corpora,
    metadatas,
    setCorpusIds,
    setCorpora,
    removeCorpus,
    hasCorpora,
  };
});
