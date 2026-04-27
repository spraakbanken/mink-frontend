import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { watchDeep } from "@vueuse/core";
import { isLexicon, type Lexicon } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { useExportStore } from "./export.store";
import { pickByType } from "@/util";
import type { FileMeta } from "@/api/api.types";
import { emptyConfig, makeConfig } from "@/lexicon/config/lexiconConfig";
import useCreateResource from "@/resource/createResource.composable";

export const useLexiconStore = defineStore("lexicon", () => {
  const resourceStore = useResourceStore();
  const { loadResource } = resourceStore;
  const { resources } = storeToRefs(resourceStore);
  const { loadExports } = useExportStore();
  const { createResource } = useCreateResource();

  const lexicons = computed<Record<string, Lexicon>>(() =>
    pickByType(resources.value, isLexicon),
  );

  const hasLexicons = computed(() => !!Object.keys(lexicons.value).length);

  async function createLexicon(name = "", files: File[] = []) {
    const configOptions = {
      ...emptyConfig(),
      name: { swe: name, eng: name },
    };
    await createResource(
      "lexicon",
      (id) => makeConfig(id, configOptions),
      files,
    );
  }

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
    createLexicon,
    loadLexicon,
    loadSources,
  };
});
