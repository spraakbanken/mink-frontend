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
import { deduplicateRequest, pickByType, setKeys } from "@/util";
import type { ResourceInfo } from "@/api/api.types";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";

export const useResourceStore = defineStore("resource", () => {
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

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

  /** Whether the list of resources is fetched and not modified. */
  let freshList = false;

  /** Which resources have fresh info loaded. */
  const freshResources = new Set<string>();

  /** Which resources have fresh config loaded. */
  const freshConfigs = new Set<string>();

  /** Load and store data about a given resource. */
  async function loadResource(
    resourceId: string,
  ): Promise<Resource | undefined> {
    if (!freshResources.has(resourceId)) {
      const data = await mink.resourceInfoOne(resourceId).catch(alertError);
      if (!data) return;
      storeResource(data);
      freshResources.add(resourceId);
    }
    return resources[resourceId] as Resource;
  }

  /** Mark a resource's info as out of date. */
  function invalidateResource(resourceId: string) {
    freshResources.delete(resourceId);
  }

  /** Fetch and store the config of a corpus. */
  async function loadConfig(corpusId: string) {
    if (!freshConfigs.has(corpusId)) {
      const config = await mink
        .loadConfig(corpusId)
        // 404 means no config which is fine.
        .catch((error) => {
          if (error.response?.status == 404) return undefined;
          alertError(error);
        });
      corpora.value[corpusId].config = config;
      freshConfigs.add(corpusId);
    }
    return corpora.value[corpusId].config;
  }

  /** Mark a corpus config as out of date */
  function invalidateConfig(corpusId: string) {
    freshConfigs.delete(corpusId);
  }

  async function uploadConfig(corpusId: string, configYaml: string) {
    await mink.saveConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    corpora.value[corpusId].config = configYaml;
    invalidateConfig(corpusId);
    loadConfig(corpusId);
  }

  /** Load resource ids and update store to match. */
  async function loadResourceIds() {
    const resourceIds = await mink.loadCorpusIds().catch(alertError);
    if (!resourceIds) return;
    setKeys(resources, resourceIds, {});
  }

  /** Load and store data about all the user's resources. */
  async function loadResourceInfo() {
    const data = await mink.resourceInfoAll().catch(alertError);
    if (!data) return;

    // Drop old keys, assign empty records for each new id
    const ids = data.resources.map((info) => info.resource.id);
    setKeys(resources, ids, {});

    data.resources.forEach(storeResource);
  }

  /** Load and store data about all the user's resources, with caching. */
  const loadResources = deduplicateRequest(async () => {
    // Skip if already loaded.
    if (freshList) return;

    // loadResourceIds has less information, but it is faster and will update UI sooner.
    await Promise.all([loadResourceIds(), loadResourceInfo()]);

    // Register that data has been loaded to skip future calls.
    freshList = true;
  });

  /** Signal that info needs to be reloaded, and immediately fetch ids. */
  async function invalidateResources() {
    freshList = false;
    await loadResourceIds();
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
    corpora,
    hasCorpora,
    invalidateConfig,
    invalidateResource,
    invalidateResources,
    loadConfig,
    loadResource,
    loadResourceIds,
    loadResourceInfo,
    loadResources,
    metadatas,
    resources,
    uploadConfig,
  };
});
