import { defineStore } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import { pickByType } from "@/util";
import { useMatomo } from "@/matomo";
import type { FileMeta } from "@/api/api.types";

export const useCorpusStore = defineStore("corpus", () => {
  const { loadResource, resources } = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  /** Which corpora have fresh changes loaded. */
  const freshChanges = new Set<string>();

  /** Which corpora have fresh config loaded. */
  const freshConfigs = new Set<string>();

  /** Which corpora have fresh exports loaded */
  const freshExports = new Set<string>();

  const corpora = computed<Record<string, Partial<Corpus>>>(() =>
    pickByType(resources, isCorpus),
  );
  const hasCorpora = computed(() => !!Object.keys(corpora).length);

  /** Load and store info for a corpus resource. */
  async function loadCorpus(
    corpusId: string,
    skipCache = false,
  ): Promise<Corpus | undefined> {
    const resource = await loadResource(corpusId, skipCache);
    return resource && isCorpus(resource) ? resource : undefined;
  }

  async function loadChanges(
    corpusId: string,
    skipCache = false,
  ): Promise<boolean | undefined> {
    if (skipCache) freshChanges.delete(corpusId);

    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (!freshChanges.has(corpusId)) {
      try {
        const changes = await mink.checkChanges(corpusId);
        const hasChanges =
          changes.sources_added ||
          changes.sources_deleted ||
          changes.sources_changed ||
          changes.config_changed;
        corpus.hasChanges = Boolean(hasChanges);
      } catch (error) {
        // Not an essential feature, don't show error.
        console.error(error);
      }
      freshChanges.add(corpusId);
    }
    return corpus.hasChanges;
  }

  /** Fetch and store the config of a corpus. */
  async function loadConfig(
    corpusId: string,
    skipCache = false,
  ): Promise<string | undefined> {
    if (skipCache) freshConfigs.delete(corpusId);

    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (!freshConfigs.has(corpusId)) {
      const config = await mink
        .loadConfig(corpusId)
        // 404 means no config which is fine.
        .catch((error) => {
          if (error.response?.status == 404) return undefined;
          alertError(error);
        });
      corpus.config = config;
      freshConfigs.add(corpusId);
    }
    return corpus.config;
  }

  async function uploadConfig(corpusId: string, configYaml: string) {
    await mink.uploadConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    corpora.value[corpusId].config = configYaml;
    loadConfig(corpusId, true);
  }

  async function loadSources(
    corpusId: string,
    skipCache = false,
  ): Promise<FileMeta[] | undefined> {
    // loadCorpus/loadResource actually uses the same API call as mink.listSources, just with different spin tokens.
    // So in theory we could end up with two of the same API call here, if loadResource cache is cold, AND
    // the skipCache arg here is set to true. But in practice, skipCache is only true after sources are added/removed,
    // in which case loadResource cache will be warm.
    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (skipCache) {
      const info = await mink.listSources(corpusId).catch(alertError);
      if (!info) return;
      corpus.sources = info.resource.source_files;
    }

    return corpus.sources;
  }

  async function runJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Start");
    const info = await mink.runJob(corpusId).catch(alertError);
    corpora.value[corpusId].job = info.job;
  }

  async function installKorp(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Korp");
    const info = await mink.installKorp(corpusId).catch(alertError);
    if (!info) return;
    corpora.value[corpusId].job = info.job;
  }

  async function installStrix(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Strix");
    const info = await mink.installStrix(corpusId).catch(alertError);
    if (!info) return;
    corpora.value[corpusId].job = info.job;
  }

  async function abortJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Abort");
    await mink.abortJob(corpusId).catch(alertError);
    await loadCorpus(corpusId, true);
  }

  async function loadExports(
    corpusId: string,
    skipCache = false,
  ): Promise<FileMeta[] | undefined> {
    if (skipCache) freshExports.delete(corpusId);

    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (!freshExports.has(corpusId)) {
      const exports = await mink.loadExports(corpusId).catch(alertError);
      if (exports) {
        /** Sorted alphabetically by path, but "stats_*" first. */
        corpus.exports = exports
          .sort((a, b) => a.path.localeCompare(b.path))
          .sort((a, b) => b.path.indexOf("stats_") - a.path.indexOf("stats_"));
        freshExports.add(corpusId);
      }
    }

    return corpus.exports;
  }

  // Refresh exports when Sparv is done
  watchDeep(corpora, (corporaNew, corporaOld) => {
    Object.keys(corporaNew).forEach((id) => {
      const sparvNew = corporaNew[id]?.job?.status.sparv;
      const sparvOld = corporaOld[id]?.job?.status.sparv;
      if (sparvNew == "done" && sparvOld && sparvOld != "done") {
        loadExports(id, true);
      }
    });
  });

  return {
    corpora,
    hasCorpora,
    loadCorpus,
    loadChanges,
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
