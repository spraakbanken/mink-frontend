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

export type Resource = {
  type: ResourceType;
  name: ByLang;
  owner?: User;
};

export type User = {
  name: string;
  id: string;
};

export type Corpus = Resource & {
  type: "corpus";
  sources: FileMeta[];
  config?: ConfigOptions;
  status: CorpusStatus;
  exports?: FileMeta[];
};

export type Metadata = Resource & {
  publicId: string;
  metadata: string; // YAML
};

// User-defined type guards to help inform TypeScript
// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export const isCorpus = (resource: Partial<Resource>): resource is Corpus =>
  resource.type == "corpus";
export const isMetadata = (resource: Partial<Resource>): resource is Metadata =>
  resource.type == "metadata";

export const useResourceStore = defineStore("resource", () => {
  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const resourcesRef = useStorage("mink@240318.resources", {});
  const resources: Record<string, {} | Resource> = reactive(resourcesRef.value);

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
      (filtered, resourceId) => {
        const resource = resources[resourceId];
        return "type" in resource && resource.type == type
          ? { ...filtered, [resourceId]: resource }
          : filtered;
      },

      {},
    );

  function setResourceIds(resourceIds: string[]) {
    setKeys(resources, resourceIds, {});
  }

  /** Update state to match fresh data. */
  function setResources(infos: ResourceInfo[]) {
    // Drop old keys, assign empty records for each new id
    const ids = infos.map((info) => info.resource.id);
    setKeys(resources, ids, {});

    infos.forEach(setResource);
  }

  /** Store new state for a given resource. */
  function setResource(info: ResourceInfo): Resource {
    const resource = {
      type: info.resource.type,
      name: info.resource.name,
      owner: info.owner
        ? { name: info.owner.name, id: info.owner.id }
        : undefined,
    };

    if (isCorpus(resource)) {
      resource.sources = info.resource.source_files;
      resource.status = info.job;
    }

    if (isMetadata(resource)) {
      resource.owner = info.owner;
      resource.publicId = info.resource.public_id;
    }

    // Merge with any existing record.
    resources[info.resource.id] = {
      ...(resources[info.resource.id] || {}),
      ...resource,
    };
    return resource;
  }

  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  return {
    resources,
    corpora,
    metadatas,
    setResourceIds,
    setResources,
    setResource,
    hasCorpora,
  };
});
