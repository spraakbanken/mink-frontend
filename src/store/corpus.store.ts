import { defineStore } from "pinia";
import { computed } from "vue";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import { pickByType } from "@/util";
import { useMatomo } from "@/matomo";

export const useCorpusStore = defineStore("corpus", () => {
  const { invalidateResource, loadResource, resources } = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  /** Which resources have fresh config loaded. */
  const freshConfigs = new Set<string>();

  const corpora = computed<Record<string, Partial<Corpus>>>(() =>
    pickByType(resources, isCorpus),
  );
  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  /** Load and store data and config for a corpus resource. */
  async function loadCorpus(corpusId: string): Promise<Corpus | undefined> {
    const resource = await loadResource(corpusId);
    if (resource && isCorpus(resource)) {
      await loadConfig(corpusId);
      return resource;
    }
    return undefined;
  }

  /** Invalidate the corpus resource and its config. */
  function invalidateCorpus(corpusId: string) {
    invalidateResource(corpusId);
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
    await mink.uploadConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    corpora.value[corpusId].config = configYaml;
    invalidateConfig(corpusId);
    loadConfig(corpusId);
  }

  async function loadSources(corpusId: string) {
    const info = await mink.listSources(corpusId).catch(alertError);
    if (!info) return;
    corpora.value[corpusId].sources = info.resource.source_files;
  }

  async function runJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Start");
    const info = await mink.runJob(corpusId).catch(alertError);
    corpora.value[corpusId].status = info.job;
  }

  async function installKorp(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Korp");
    const info = await mink.installKorp(corpusId).catch(alertError);
    if (!info) return;
    corpora.value[corpusId].status = info.job;
  }

  async function installStrix(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Strix");
    const info = await mink.installStrix(corpusId).catch(alertError);
    if (!info) return;
    corpora.value[corpusId].status = info.job;
  }

  async function abortJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Abort");
    await mink.abortJob(corpusId).catch(alertError);
    invalidateCorpus(corpusId);
    await loadCorpus(corpusId);
  }

  async function loadExports(corpusId: string) {
    const exports = await mink.loadExports(corpusId).catch(alertError);
    corpora.value[corpusId].exports = exports;
  }

  return {
    invalidateCorpus,
    corpora,
    hasCorpora,
    loadCorpus,
    loadConfig,
    loadSources,
    invalidateConfig,
    uploadConfig,
    runJob,
    abortJob,
    installKorp,
    installStrix,
    loadExports,
  };
});
