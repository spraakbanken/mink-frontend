import { computed, watch } from "vue";
import { uniq } from "es-toolkit";
import { useInterval } from "@vueuse/core";
import { useCorpusStore } from "@/store/corpus.store";
import useLocale from "@/i18n/locale.composable";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import { downloadFile, getException, getFilenameExtension } from "@/util";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import type { FileMeta, JobType, ProgressHandler } from "@/api/api.types";
import { useMatomo } from "@/matomo";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker: Record<string, boolean> = {};

export function useCorpus(corpusId: string) {
  const corpusStore = useCorpusStore();
  const { th } = useLocale();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  const corpus = computed(() => corpusStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
  const configOptions = computed(getParsedConfig);
  const corpusName = computed(() => th(configOptions.value?.name));
  const hasMetadata = computed(
    () => configOptions.value?.name?.swe || configOptions.value?.name?.eng,
  );
  const isConfigValid = computed(
    () =>
      configOptions.value &&
      !getException(() => validateConfig(configOptions.value!)),
  );

  const sources = computed(() => corpus.value?.sources || []);
  const hasSources = computed(() => sources.value.length > 0);
  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      sources.value?.map((source) => getFilenameExtension(source.name)) || [],
    ),
  );

  const jobStatus = computed(() => corpus.value?.status);
  const jobState = computed(() => corpus.value?.status?.status);
  const currentStatus = computed(() => {
    const process = jobStatus.value?.current_process;
    return process && jobStatus.value?.status?.[process];
  });
  const hasError = computed(() =>
    Object.values(jobState.value || {}).includes("error"),
  );

  // "Running" if any job is waiting/running.
  const isJobRunning = computed(() => {
    const statuses = jobState.value;
    if (!statuses) return false;
    return (Object.keys(statuses) as JobType[]).some((process) =>
      ["waiting", "running"].includes(statuses[process]),
    );
  });

  // "Done" if Sparv is done, and Korp is not running/error.
  const isJobDone = computed(
    () =>
      jobState.value?.sparv == "done" &&
      ["none", "aborted", "done"].includes(jobState.value.korp),
  );

  async function clearAnnotations() {
    matomo?.trackEvent("Corpus", "Annotation", "Clear");
    await mink.clearAnnotations(corpusId).catch(alertError);
    corpusStore.invalidateExports(corpusId);
    await corpusStore.loadExports(corpusId);
  }

  /** Exports sorted alphabetically by path, but "stats_*" first. */
  const exports = computed(() =>
    // Shallow-clone list to avoid modifying the computed value.
    [...(corpusStore.corpora[corpusId]?.exports || [])]
      ?.sort((a, b) => a.path.localeCompare(b.path))
      .sort((a, b) => b.path.indexOf("stats_") - a.path.indexOf("stats_")),
  );

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
    return mink.downloadSource(corpusId, source.name, binary).catch(alertError);
  }

  async function downloadPlaintext(source: FileMeta) {
    return mink.downloadPlaintext(corpusId, source.name).catch(alertError);
  }

  async function uploadSources(files: File[], onProgress?: ProgressHandler) {
    await mink.uploadSources(corpusId, files, onProgress);
    corpusStore.loadSources(corpusId);
  }

  async function deleteSource(source: FileMeta) {
    await mink.deleteSource(corpusId, source.name).catch(alertError);
    corpusStore.loadSources(corpusId);
  }

  // Check status intermittently if active.
  watch(pollTick, async () => {
    // This composable can be active in multiple components with the same corpus id. Only send request once per corpus.
    if (isJobRunning.value && !pollTracker[corpusId]) {
      pollTracker[corpusId] = true;
      corpusStore.invalidateCorpus(corpusId);
      await corpusStore.loadCorpus(corpusId);
      pollTracker[corpusId] = false;
    }
  });

  function getDownloadFilename() {
    return corpusId + ".zip";
  }

  async function downloadResult() {
    matomo?.trackEvent("Corpus", "Download", "Export archive");
    const data = await mink.downloadExports(corpusId).catch(alertError);
    if (!data) return;
    downloadFile(data, getDownloadFilename());
  }

  async function downloadResultFile(path: string) {
    const filename = path.split("/").pop()!;
    matomo?.trackEvent("Corpus", "Download", "Export file");
    const data = await mink
      .downloadExportFiles(corpusId, path)
      .catch(alertError);
    if (!data) return;
    downloadFile(data, filename);
  }

  return {
    config,
    configOptions,
    corpusName,
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
    jobStatus,
    jobState,
    currentStatus,
    isJobRunning,
    isJobDone,
    hasError,
    clearAnnotations,
    exports,
    downloadResult,
    downloadResultFile,
    getDownloadFilename,
  };
}
