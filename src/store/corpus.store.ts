import { defineStore } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";
import { pickByType } from "@/util";
import { useMatomo } from "@/matomo";
import type { FileMeta } from "@/api/api.types";
import api from "@/api/api";

export const useCorpusStore = defineStore("corpus", () => {
  const { loadResource, resources } = useResourceStore();
  const { alertError } = useMessenger();
  const { spin } = useSpin();
  const matomo = useMatomo();

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

  /** Fetch and store the config of a corpus. */
  async function loadConfig(
    corpusId: string,
    skipCache = false,
  ): Promise<string | undefined> {
    if (skipCache) freshConfigs.delete(corpusId);

    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (!freshConfigs.has(corpusId)) {
      const config = await spin(
        api.downloadConfig(corpusId).catch(alertError),
        `corpus/${corpusId}/config`,
      );
      corpus.config = config;
      freshConfigs.add(corpusId);
    }
    return corpus.config;
  }

  async function uploadConfig(corpusId: string, configYaml: string) {
    await spin(
      api.uploadConfig(corpusId, configYaml),
      `corpus/${corpusId}/config`,
    );
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    corpora.value[corpusId]!.config = configYaml;
    loadConfig(corpusId, true);
    // Get new title
    loadCorpus(corpusId, true);
  }

  async function loadSources(
    corpusId: string,
    skipCache = false,
  ): Promise<FileMeta[] | undefined> {
    // api.resourceInfoOne() is used first through loadCorpus() and then directly.
    // But in practice it will only be called once, because `skipCache` is only true after uploading,
    // in which case loadCorpus() will use a warm cache.
    const corpus = await loadCorpus(corpusId);
    if (!corpus) return;

    if (skipCache) {
      const info = await spin(
        api.resourceInfoOne(corpusId).catch(alertError),
        `corpus/${corpusId}/sources/list`,
      );
      if (!info) return;
      corpus.sources = info.resource.source_files.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    return corpus.sources;
  }

  async function runJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Start");
    const info = await spin(
      api.runSparv(corpusId).catch(alertError),
      `corpus/${corpusId}/job/sparv`,
    );
    corpora.value[corpusId]!.job = info.job;
  }

  async function installKorp(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Korp");
    const info = await spin(
      api.installKorp(corpusId).catch(alertError),
      `corpus/${corpusId}/job/install/korp`,
    );
    if (!info) return;
    corpora.value[corpusId]!.job = info.job;
  }

  async function installStrix(corpusId: string) {
    matomo?.trackEvent("Corpus", "Tool install", "Strix");
    const info = await spin(
      api.installStrix(corpusId).catch(alertError),
      `corpus/${corpusId}/job/install/strix`,
    );
    if (!info) return;
    corpora.value[corpusId]!.job = info.job;
  }

  async function abortJob(corpusId: string) {
    matomo?.trackEvent("Corpus", "Annotation", "Abort");
    await spin(
      api.abortJob(corpusId).catch(alertError),
      `corpus/${corpusId}/job/abort`,
    );
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
      const exports = await spin(
        api.listExports(corpusId).catch(alertError),
        `corpus/${corpusId}/exports/list`,
      );
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
