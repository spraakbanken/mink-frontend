import { defineStore } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import { pickByType } from "@/util";
import { useMatomo } from "@/matomo";

export const useCorpusStore = defineStore("corpus", () => {
  const { loadResource, resources } = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  /** Which corpora have fresh config loaded. */
  const freshConfigs = new Set<string>();

  /** Which corpora have fresh exports loaded */
  const freshExports = new Set<string>();

  const corpora = computed<Record<string, Partial<Corpus>>>(() =>
    pickByType(resources, isCorpus),
  );
  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  /** Load and store data and config for a corpus resource. */
  async function loadCorpus(
    corpusId: string,
    skipCache = false,
  ): Promise<Corpus | undefined> {
    const resource = await loadResource(corpusId, skipCache);
    if (resource && isCorpus(resource)) {
      await loadConfig(corpusId);
      return resource;
    }
    return undefined;
  }

  /** Fetch and store the config of a corpus. */
  async function loadConfig(corpusId: string, skipCache = false) {
    if (skipCache) freshConfigs.delete(corpusId);
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

  async function uploadConfig(corpusId: string, configYaml: string) {
    await mink.uploadConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    corpora.value[corpusId].config = configYaml;
    loadConfig(corpusId, true);
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
    await loadCorpus(corpusId, true);
  }

  async function loadExports(corpusId: string, skipCache = false) {
    if (skipCache) freshExports.delete(corpusId);
    if (!freshExports.has(corpusId)) {
      const exports = await mink.loadExports(corpusId).catch(alertError);
      corpora.value[corpusId].exports = exports;
      freshExports.add(corpusId);
    }
    return corpora.value[corpusId].exports;
  }

  // Refresh exports when Sparv is done
  watchDeep(corpora, (corporaNew, corporaOld) => {
    Object.keys(corporaNew).forEach((id) => {
      if (
        corporaNew[id]?.status?.status.sparv == "done" &&
        corporaOld[id]?.status?.status.sparv != "done"
      ) {
        loadExports(id, true);
      }
    });
  });

  return {
    corpora,
    hasCorpora,
    loadCorpus,
    loadConfig,
    loadSources,
    uploadConfig,
    runJob,
    abortJob,
    installKorp,
    installStrix,
    loadExports,
  };
});
