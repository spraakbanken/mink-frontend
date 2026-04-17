import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { isCorpus, type Corpus } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { useExportStore } from "./export.store";
import useSpin from "@/spin/spin.composable";
import { pickByType } from "@/util";
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

  async function installKorp(id: string) {
    matomo.value?.trackEvent("Job", "Install", "corpus korp");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "korp"),
      `${id}/job/install/korp`,
    );
    resource.job = info.job;
  }

  async function installStrix(id: string) {
    matomo.value?.trackEvent("Job", "Install", "corpus strix");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("corpus", id, "strix"),
      `${id}/job/install/strix`,
    );
    resource.job = info.job;
  }

  async function uninstallKorp(id: string) {
    matomo.value?.trackEvent("Job", "Uninstall", "corpus korp");
    await spin(api.uninstall("corpus", id, "korp"), `${id}/job/install/korp`);
    // Get updated job info
    await loadCorpus(id, true);
  }

  async function uninstallStrix(id: string) {
    matomo.value?.trackEvent("Job", "Uninstall", "corpus strix");
    await spin(api.uninstall("corpus", id, "strix"), `${id}/job/install/strix`);
    // Get updated job info
    await loadCorpus(id, true);
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
    installKorp,
    installStrix,
    uninstallKorp,
    uninstallStrix,
  };
});
