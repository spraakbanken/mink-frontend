import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import {
  isCorpus,
  isMetadata,
  type Metadata,
  type Resource,
} from "./resource.types";
import { pickByType, setKeys } from "@/util";
import api from "@/api/api";
import type { ResourceInfo } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";

export const useResourceStore = defineStore("resource", () => {
  const { alertError } = useMessenger();
  const { spin } = useSpin();

  // Connect state to browser's local storage. Change the number here to the
  // current date (YYMMDD) if the state shape is changed, to make the browser
  // forget the old state. The actual number doesn't really matter, as long as
  // it's a new one.
  const resourcesRef = useStorage("mink@250530.resources", {});
  const resources: Record<string, object | Resource> = reactive(
    resourcesRef.value,
  );

  const metadatas = computed<Record<string, Partial<Metadata>>>(() =>
    pickByType(resources, isMetadata),
  );

  // Resource fetching is essentially on three levels: list, info and (only for corpus) config.
  // (Additionally, there's exports, but it has a more specific use.)
  // For each of the three levels, we have flags to indicate whether data is fresh or not.
  // This enables a pattern of using cached async load functions when using data, and invalidating
  // caches when data is known to be out of date.

  /** Whether the list of resources is fetched and not modified. */
  let freshList = false;

  /** Which resources have fresh info loaded. */
  const freshResources = new Set<string>();

  /** Load resource ids and update store to match. */
  async function loadResourceIds() {
    const resourceIds = await spin(
      api.listCorpora().catch(alertError),
      "corpora",
    );
    if (!resourceIds) return;
    setKeys(resources, resourceIds, {});
  }

  /** Load and store data about all the user's resources. */
  async function loadResources() {
    // Skip if already loaded.
    if (!freshList) {
      const data = await spin(
        api.resourceInfoAll().catch(alertError),
        "corpora",
      );
      if (!data) return;

      // Drop old keys, assign empty records for each new id
      const ids = data.resources.map((info) => info.resource.id);
      setKeys(resources, ids, {});
      // Store resource info
      data.resources.forEach(storeResource);
      freshList = true;
    }

    return resources;
  }

  /** Signal that info needs to be reloaded, and immediately fetch ids. */
  async function invalidateResources() {
    freshList = false;
    await loadResourceIds();
  }

  /** Load and store data about a given resource. */
  async function loadResource(
    resourceId: string,
    skipCache = false,
  ): Promise<Resource | undefined> {
    if (skipCache) freshResources.delete(resourceId);
    if (!freshResources.has(resourceId)) {
      const data = await spin(
        api.resourceInfoOne(resourceId).catch(alertError),
        `corpus/${resourceId}/info`,
      );
      if (!data) return;
      storeResource(data);
    }
    return resources[resourceId] as Resource;
  }

  /** Store new state for a given resource. */
  function storeResource(info: ResourceInfo): Resource {
    const resource = {
      type: info.resource.type,
      name: info.resource.name,
      owner: info.owner
        ? { name: info.owner.name, id: info.owner.id }
        : undefined,
    };

    if (isCorpus(resource)) {
      resource.sources = info.resource.source_files;
      resource.job = info.job;
    }

    if (isMetadata(resource)) {
      resource.owner = info.owner;
      resource.publicId = info.resource.public_id;
    }

    // Merge with any existing record.
    const id = info.resource.id;
    resources[id] = {
      ...(resources[id] || {}),
      ...resource,
    };
    freshResources.add(id);
    return resource;
  }

  return {
    invalidateResources,
    loadResource,
    loadResourceIds,
    loadResources,
    metadatas,
    resources,
  };
});
