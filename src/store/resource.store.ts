import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import {
  isCorpus,
  isMetadata,
  type Corpus,
  type Metadata,
  type Resource,
} from "./resource.types";
import { pickByType, setKeys } from "@/util";
import type { ResourceInfo } from "@/api/api.types";

export const useResourceStore = defineStore("resource", () => {
  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const resourcesRef = useStorage("mink@240417.resources", {});
  const resources: Record<string, object | Resource> = reactive(
    resourcesRef.value,
  );

  const corpora = computed<Record<string, Partial<Corpus>>>(() =>
    pickByType(resources, isCorpus),
  );
  const metadatas = computed<Record<string, Partial<Metadata>>>(() =>
    pickByType(resources, isMetadata),
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
