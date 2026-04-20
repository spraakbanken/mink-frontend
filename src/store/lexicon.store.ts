import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { isLexicon, type Lexicon } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { useExportStore } from "./export.store";
import useSpin from "@/spin/spin.composable";
import { pickByType } from "@/util";
import type { FileMeta } from "@/api/api.types";
import api from "@/api/api";

export const useLexiconStore = defineStore("lexicon", () => {
  const resourceStore = useResourceStore();
  const { loadResource } = resourceStore;
  const { resources } = storeToRefs(resourceStore);
  const { loadExports } = useExportStore();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const lexicons = computed<Record<string, Lexicon>>(() =>
    pickByType(resources.value, isLexicon),
  );

  const hasLexicons = computed(() => !!Object.keys(lexicons.value).length);

  /** Load and store info for a lexicon resource. */
  async function loadLexicon(id: string, skipCache = false): Promise<Lexicon> {
    const resource = await loadResource(id, skipCache);
    return resource as Lexicon;
  }

  async function loadSources(
    id: string,
    skipCache = false,
  ): Promise<FileMeta[]> {
    const resource = await loadResource(id, skipCache, `${id}/sources/list`);
    return resource.sources;
  }

  async function installKarps(id: string) {
    matomo.value?.trackEvent("Job", "Install", "lexicon karps");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("lexicon", id, "karps"),
      `${id}/job/install/karps`,
    );
    resource.job = info.job;
  }

  async function uninstallKarps(id: string) {
    matomo.value?.trackEvent("Job", "Uninstall", "lexicon karps");
    await spin(
      api.uninstall("lexicon", id, "karps"),
      `${id}/job/install/karps`,
    );
    // Get updated job info
    await loadLexicon(id, true);
  }

  // Refresh exports when Sparv is done
  watchDeep(lexicons, (lexiconsNew, lexiconsOld) => {
    Object.keys(lexiconsNew).forEach((id) => {
      const statusNew = lexiconsNew[id]?.job?.status.karp_pipeline;
      const statusOld = lexiconsOld[id]?.job?.status.karp_pipeline;
      if (statusNew == "done" && statusOld && statusOld != "done") {
        loadExports("lexicon", id, true);
      }
    });
  });

  return {
    lexicons,
    hasLexicons,
    loadLexicon,
    loadSources,
    installKarps,
    uninstallKarps,
  };
});
