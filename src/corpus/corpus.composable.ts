import { computed, watch } from "vue";
import { attempt, uniq } from "es-toolkit";
import { useInterval } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { useCorpusStore } from "@/store/corpus.store";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import { downloadFile, getFilenameExtension } from "@/util";
import useSpin from "@/spin/spin.composable";
import type { FileMeta, ProgressHandler } from "@/api/api.types";
import api from "@/api/api";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker: Record<string, boolean> = {};

export function useCorpus(id: string) {
  const corpusStore = useCorpusStore();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const corpus = computed(() => {
    corpusStore.loadCorpus(id);
    return corpusStore.corpora[id];
  });

  const config = computed(() => {
    corpusStore.loadConfig(id);
    return corpus.value?.config || undefined;
  });
  const configOptions = computed(getParsedConfig);
  const isConfigValid = computed(
    () => !attempt(() => validateConfig(configOptions.value!))[0],
  );

  const sources = computed(() => {
    corpusStore.loadSources(id);
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
  const hasError = computed(() => currentStatus.value == "error");

  // "Running" if any job is waiting/running.
  const isJobRunning = computed(() => {
    if (!jobState.value) return false;
    return Object.values(jobState.value).some((state) =>
      ["waiting", "running"].includes(state),
    );
  });

  async function clearAnnotations() {
    matomo.value?.trackEvent("Corpus", "Annotation", "Clear");
    await spin(api.clearAnnotations(id), `${id}/exports/list`);
    await corpusStore.loadExports(id, true);
  }

  /** Exports sorted alphabetically by path, but "stats_*" first. */
  const exports = computed(() => {
    corpusStore.loadExports(id);
    return corpus.value?.exports || [];
  });

  async function saveConfigOptions(configOptions: ConfigOptions) {
    const configYaml = makeConfig(id, configOptions);
    await corpusStore.uploadConfig(id, configYaml);
  }

  function getParsedConfig() {
    if (!config.value) return undefined;
    try {
      const parsed = parseConfig(config.value);
      return parsed;
    } catch (error) {
      console.error(`Error parsing config for "${id}":`, error);
    }
  }

  async function downloadSource(source: FileMeta, binary: boolean) {
    return spin(
      api.downloadSources(id, source.name, binary),
      `${id}/sources/${source.name}/raw`,
    );
  }

  async function downloadPlaintext(source: FileMeta) {
    return spin(
      api.downloadSourceText(id, source.name),
      `${id}/sources/${source.name}/plain`,
    );
  }

  async function uploadSources(files: File[], onProgress?: ProgressHandler) {
    await spin(
      api.uploadSources(id, files, onProgress),
      `${id}/sources/upload`,
    );
    corpusStore.loadSources(id, true);
  }

  async function deleteSource(source: FileMeta) {
    await spin(api.removeSource(id, source.name), `${id}/sources/list`);
    corpusStore.loadSources(id, true);
  }

  // Check status intermittently if active.
  watch(pollTick, async () => {
    // This composable can be active in multiple components with the same corpus id. Only send request once per corpus.
    if (isJobRunning.value && !pollTracker[id]) {
      pollTracker[id] = true;
      await corpusStore.loadCorpus(id, true);
      pollTracker[id] = false;
    }
  });

  function getDownloadFilename() {
    return id + ".zip";
  }

  async function downloadResult() {
    matomo.value?.trackEvent("Corpus", "Download", "Export archive");
    const data = await spin(api.downloadExports(id), `${id}/exports/download`);
    downloadFile(data, getDownloadFilename());
  }

  async function downloadResultFile(path: string) {
    const filename = path.split("/").pop()!;
    matomo.value?.trackEvent("Corpus", "Download", "Export file");
    const data = await loadResultFile(path);
    downloadFile(data, filename);
  }

  async function loadResultFile(path: string) {
    return spin(api.downloadExportFile(id, path), `${id}/exports/${path}`);
  }

  return {
    corpus,
    config,
    configOptions,
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
    loadResultFile,
    getDownloadFilename,
  };
}
