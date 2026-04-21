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

  const exports = computedAsync(() => loadExports("corpus", id), undefined, {
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
    await loadExports("corpus", id, true);
  }

  async function saveConfigOptions(configOptions: ConfigOptions) {
    const configYaml = makeConfig(id, configOptions);
    await uploadConfig("corpus", id, configYaml);
  }

  async function installKorp() {
    matomo.value?.trackEvent("Job", "Install", "corpus korp");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "korp"),
      `${id}/job/install/korp`,
    );
    resource.job = info.job;
  }

  async function installStrix() {
    matomo.value?.trackEvent("Job", "Install", "corpus strix");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "strix"),
      `${id}/job/install/strix`,
    );
    resource.job = info.job;
  }

  async function uninstallKorp() {
    matomo.value?.trackEvent("Job", "Uninstall", "corpus korp");
    await spin(api.uninstall("corpus", id, "korp"), `${id}/job/install/korp`);
    // Get updated job info
    await loadResource(id, true, `${id}/job/install/korp`);
  }

  async function uninstallStrix() {
    matomo.value?.trackEvent("Job", "Uninstall", "corpus strix");
    await spin(api.uninstall("corpus", id, "strix"), `${id}/job/install/strix`);
    // Get updated job info
    await loadResource(id, true, `${id}/job/install/strix`);
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

  return {
    corpus,
    config,
    configOptions,
    isConfigValid,
    exports,
    saveConfigOptions,
    updateSourceFormat,
    clearAnnotations,
    installKorp,
    installStrix,
    uninstallKorp,
    uninstallStrix,
  };
}
