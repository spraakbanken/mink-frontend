import { computed, watch } from "vue";
import { attempt, uniq } from "es-toolkit";
import { useInterval } from "@vueuse/core";
import { useCorpusStore } from "@/store/corpus.store";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import { downloadFile, getFilenameExtension } from "@/util";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";
import type { FileMeta, ProgressHandler } from "@/api/api.types";
import { useMatomo } from "@/matomo";
import api from "@/api/api";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker: Record<string, boolean> = {};

export function useCorpus(corpusId: string) {
  const corpusStore = useCorpusStore();
  const { alertError } = useMessenger();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const corpus = computed(() => {
    corpusStore.loadCorpus(corpusId);
    return corpusStore.corpora[corpusId];
  });

  const config = computed(() => {
    corpusStore.loadConfig(corpusId);
    return corpus.value?.config || undefined;
  });
  const configOptions = computed(getParsedConfig);
  const hasMetadata = computed(
    () => configOptions.value?.name?.swe || configOptions.value?.name?.eng,
  );
  const isConfigValid = computed(
    () => !attempt(() => validateConfig(configOptions.value!))[0],
  );

  const sources = computed(() => {
    corpusStore.loadSources(corpusId);
    return corpus.value?.sources || [];
  });
  const hasSources = computed(() => sources.value.length > 0);
  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      sources.value?.map((source) => getFilenameExtension(source.name)) || [],
    ),
  );

  const job = computed(() => corpus.value?.job);
  const jobState = computed(() => corpus.value?.job?.status);
  const currentStatus = computed(() => {
    const process = job.value?.current_process;
    return process && job.value?.status?.[process];
  });
  const hasError = computed(() =>
    Object.values(jobState.value || {}).includes("error"),
  );

  // "Running" if any job is waiting/running.
  const isJobRunning = computed(() => {
    if (!jobState.value) return false;
    return Object.values(jobState.value).some((state) =>
      ["waiting", "running"].includes(state),
    );
  });

  async function clearAnnotations() {
    matomo?.trackEvent("Corpus", "Annotation", "Clear");
    await spin(
      api.clearAnnotations(corpusId).catch(alertError),
      `corpus/${corpusId}/exports`,
    );
    await corpusStore.loadExports(corpusId, true);
  }

  /** Exports sorted alphabetically by path, but "stats_*" first. */
  const exports = computed(() => {
    corpusStore.loadExports(corpusId);
    return corpus.value?.exports || [];
  });

  async function saveConfigOptions(configOptions: ConfigOptions) {
    const configYaml = makeConfig(corpusId, configOptions);
    await corpusStore.uploadConfig(corpusId, configYaml);
  }

  function getParsedConfig() {
    if (!config.value) return undefined;
    try {
      const parsed = parseConfig(config.value);
      return parsed;
    } catch (error) {
      console.error(`Error parsing config for "${corpusId}":`, error);
    }
  }

  async function downloadSource(source: FileMeta, binary: boolean) {
    return spin(
      api.downloadSources(corpusId, source.name, binary),
      `corpus/${corpusId}/sources/${source.name}/raw`,
    ).catch(alertError);
  }

  async function downloadPlaintext(source: FileMeta) {
    return spin(
      api.downloadSourceText(corpusId, source.name),
      `corpus/${corpusId}/sources/${source.name}/plain`,
    ).catch(alertError);
  }

  async function uploadSources(files: File[], onProgress?: ProgressHandler) {
    await spin(
      api.uploadSources(corpusId, files, onProgress),
      `corpus/${corpusId}/sources/upload`,
    );
    corpusStore.loadSources(corpusId, true);
  }

  async function deleteSource(source: FileMeta) {
    await spin(
      api.removeSource(corpusId, source.name),
      `corpus/${corpusId}/sources/list`,
    ).catch(alertError);
    corpusStore.loadSources(corpusId, true);
  }

  // Check status intermittently if active.
  watch(pollTick, async () => {
    // This composable can be active in multiple components with the same corpus id. Only send request once per corpus.
    if (isJobRunning.value && !pollTracker[corpusId]) {
      pollTracker[corpusId] = true;
      await corpusStore.loadCorpus(corpusId, true);
      pollTracker[corpusId] = false;
    }
  });

  function getDownloadFilename() {
    return corpusId + ".zip";
  }

  async function downloadResult() {
    matomo?.trackEvent("Corpus", "Download", "Export archive");
    const data = await spin(
      api.downloadExports(corpusId).catch(alertError),
      `corpus/${corpusId}/exports/download`,
    );
    if (!data) return;
    downloadFile(data, getDownloadFilename());
  }

  async function downloadResultFile(path: string) {
    try {
      const filename = path.split("/").pop()!;
      matomo?.trackEvent("Corpus", "Download", "Export file");
      const data = await spin(
        api.downloadExportFile(corpusId, path),
        `corpus/${corpusId}/exports/download`,
      );
      downloadFile(data, filename);
    } catch (error) {
      alertError(error);
    }
  }

  return {
    corpus,
    config,
    configOptions,
    hasMetadata,
    isConfigValid,
    saveConfigOptions,
    sources,
    hasSources,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
    extensions,
    job,
    jobState,
    currentStatus,
    isJobRunning,
    hasError,
    clearAnnotations,
    exports,
    downloadResult,
    downloadResultFile,
    getDownloadFilename,
  };
}
