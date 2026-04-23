import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { useExportStore } from "./export.store";
import useSpin from "@/spin/spin.composable";
import { pickByType } from "@/util";
import type { FileMeta } from "@/api/api.types";
import api from "@/api/api";

export const useCorpusStore = defineStore("corpus", () => {
  const resourceStore = useResourceStore();
  const { loadResource } = resourceStore;
  const { resources } = storeToRefs(resourceStore);
  const { loadExports } = useExportStore();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const corpora = computed<Record<string, Corpus>>(() =>
    pickByType(resources.value, isCorpus),
  );

  const hasCorpora = computed(() => !!Object.keys(corpora.value).length);

  /** Load and store info for a corpus resource. */
  async function loadCorpus(id: string, skipCache = false): Promise<Corpus> {
    const resource = await loadResource(id, skipCache);
    return resource as Corpus;
  }

  async function loadSources(
    id: string,
    skipCache = false,
  ): Promise<FileMeta[]> {
    const resource = await loadResource(id, skipCache, `${id}/sources/list`);
    return resource.sources;
  }

  async function runJob(id: string) {
    matomo.value?.trackEvent("Corpus", "Annotation", "Start");
    const resource = await loadResource(id);
    const info = await spin(api.runJob("corpus", id), `${id}/job/sparv`);
    resource.job = info.job;
  }

  async function installKorp(id: string) {
    matomo.value?.trackEvent("Corpus", "Tool install", "Korp");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "korp"),
      `${id}/job/install/korp`,
    );
    resource.job = info.job;
  }

  async function installStrix(id: string) {
    matomo.value?.trackEvent("Corpus", "Tool install", "Strix");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "strix"),
      `${id}/job/install/strix`,
    );
    resource.job = info.job;
  }

  async function uninstallKorp(id: string) {
    matomo.value?.trackEvent("Corpus", "Tool uninstall", "Korp");
    await spin(api.uninstall("corpus", id, "korp"), `${id}/job/install/korp`);
    // Get updated job info
    await loadCorpus(id, true);
  }

  async function uninstallStrix(id: string) {
    matomo.value?.trackEvent("Corpus", "Tool uninstall", "Strix");
    await spin(api.uninstall("corpus", id, "strix"), `${id}/job/install/strix`);
    // Get updated job info
    await loadCorpus(id, true);
  }

  async function abortJob(id: string) {
    matomo.value?.trackEvent("Corpus", "Annotation", "Abort");
    await spin(api.abortJob("corpus", id), `${id}/job/abort`);
    // Get updated job info
    await loadCorpus(id, true);
  }

  // Refresh exports when Sparv is done
  watchDeep(corpora, (corporaNew, corporaOld) => {
    Object.keys(corporaNew).forEach((id) => {
      const sparvNew = corporaNew[id]?.job?.status.sparv;
      const sparvOld = corporaOld[id]?.job?.status.sparv;
      if (sparvNew == "done" && sparvOld && sparvOld != "done") {
        loadExports("corpus", id, true);
      }
    });
  });

  return {
    corpora,
    hasCorpora,
    loadCorpus,
    loadSources,
    runJob,
    abortJob,
    installKorp,
    installStrix,
    uninstallKorp,
    uninstallStrix,
  };
});
