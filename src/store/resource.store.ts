import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { pick } from "es-toolkit";
import {
  isCorpus,
  isMetadata,
  type Metadata,
  type Resource,
} from "./resource.types";
import { filterKeys, pickByType } from "@/util";
import api from "@/api/api";
import type { ResourceInfo } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";

export const useResourceStore = defineStore("resource", () => {
  const { spin } = useSpin();

  const resourceIds = ref<string[]>([]);
  const resources = reactive<Record<string, Resource>>({});

  const metadatas = computed<Record<string, Metadata>>(() =>
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
    const ids = await spin(api.listCorpora(), "resources");
    resourceIds.value = ids;

    // Forget absent resources
    filterKeys(resources, ids);
  }

  /** Load and store data about all the user's resources. */
  async function loadResources() {
    // Skip if already loaded.
    if (!freshList) {
      const data = await spin(api.resourceStatusList(), "resources");
      const ids = data.resources.map((info) => info.resource.id);
      resourceIds.value = ids;

      // Forget old resources and store fresh info
      filterKeys(resources, ids);
      data.resources.forEach(storeResource);
      freshList = true;
    }

    return resources;
  }

  /** Signal that info needs to be reloaded */
  async function invalidateResources() {
    freshList = false;
  }

  /** Load and store data about a given resource. */
  async function loadResource(
    resourceId: string,
    skipCache = false,
  ): Promise<Resource> {
    if (skipCache) freshResources.delete(resourceId);
    if (!freshResources.has(resourceId)) {
      const data = await spin(
        api.resourceStatusGet(resourceId),
        `corpus/${resourceId}/info`,
      );
      storeResource(data);
    }
    return resources[resourceId];
  }

  /** Store new state for a given resource. */
  function storeResource(info: ResourceInfo): Resource {
    const resource = {
      type: info.resource.type,
      name: info.resource.name,
      owner: pick(info.owner, ["id", "email", "name"]),
    };

    if (isCorpus(resource)) {
      resource.sources = info.resource.source_files;
      resource.job = info.job;
    }

    if (isMetadata(resource)) {
      resource.publicId = info.resource.public_id;
    }

    const id = info.resource.id;
    if (!resourceIds.value.includes(id)) resourceIds.value.push(id);

    // Merge with any existing record.
    resources[id] = {
      ...resources[id],
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
    resourceIds,
    resources,
  };
});
