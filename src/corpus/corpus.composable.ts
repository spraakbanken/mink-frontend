import { computed, watch } from "vue";
import { attempt } from "es-toolkit";
import { computedAsync, useInterval } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
  type CorpusSourceFormat,
} from "@/api/corpusConfig";
import { downloadFile } from "@/util";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";
import { useConfigStore } from "@/store/config.store";
import { useExportStore } from "@/store/export.store";
import { useResourceStore } from "@/store/resource.store";
import { CORPUS_SOURCE_FORMATS } from "@/file";
import useResource from "@/resource/resource.composable";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker: Record<string, boolean> = {};

export function useCorpus(id: string) {
  const { loadTypedResource, loadResource } = useResourceStore();
  const { isRunning } = useResource(id);
  const { loadConfig, uploadConfig } = useConfigStore();
  const { loadExports } = useExportStore();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const corpus = computedAsync(() => loadTypedResource("corpus", id));

  const config = computedAsync(() => loadConfig("corpus", id), undefined, {
    lazy: true,
  });

  const exports = computedAsync(() => loadExports(id), undefined, {
    lazy: true,
  });

  const configOptions = computed(() => {
    try {
      if (config.value) return parseConfig(config.value);
    } catch (error) {
      console.error(`Error parsing config for "${id}":`, error);
    }
    return undefined;
  });

  const isConfigValid = computed(
    () => !attempt(() => validateConfig(configOptions.value!))[0],
  );

  /** Update importer in corpus config according to source format if needed */
  async function updateSourceFormat(extension: string) {
    const format = extension as CorpusSourceFormat;
    if (
      configOptions.value &&
      format != configOptions.value.format &&
      CORPUS_SOURCE_FORMATS.includes(format)
    ) {
      await saveConfigOptions({ ...configOptions.value, format });
    }
  }

  async function clearAnnotations() {
    matomo.value?.trackEvent("Corpus", "Annotation", "Clear");
    await spin(api.clearAnnotations(id), `${id}/exports/list`);
    await loadExports(id, true);
  }

  async function saveConfigOptions(configOptions: ConfigOptions) {
    const configYaml = makeConfig(id, configOptions);
    await uploadConfig("corpus", id, configYaml);
  }

  // Check status intermittently if active.
  watch(pollTick, async () => {
    // This composable can be active in multiple components with the same corpus id. Only send request once per corpus.
    if (isRunning.value && !pollTracker[id]) {
      pollTracker[id] = true;
      await loadResource(id, true);
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
    updateSourceFormat,
    clearAnnotations,
    exports,
    downloadResult,
    downloadResultFile,
    loadResultFile,
    getDownloadFilename,
  };
}
