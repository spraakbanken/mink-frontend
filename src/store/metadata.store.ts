import { defineStore } from "pinia";
import { computed, reactive, readonly } from "vue";
import { isMetadata, type Metadata } from "./resource.types";
import { useResourceStore } from "./resource.store";
import { pickByType } from "@/util";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";

export const useMetadataStore = defineStore("metadata", () => {
  const { loadResource, resources } = useResourceStore();
  const { spin } = useSpin();

  const metadatas = computed<Record<string, Metadata>>(() =>
    pickByType(resources, isMetadata),
  );

  /** Config YAML strings by resource id */
  // TODO Merge with useConfigStore when the backend routes have been merged.
  const configs = reactive<Record<string, string | undefined>>({});

  /** Fetch and store the config of a metadata resource. */
  // TODO Merge with useConfigStore when the backend routes have been merged.
  async function loadConfig(
    id: string,
    skipCache = false,
  ): Promise<string | undefined> {
    if (skipCache || !configs[id]) {
      const config = await spin(
        api.downloadConfig("metadata", id),
        `resource/${id}/metadata`,
      );
      configs[id] = config;
    }
    return configs[id];
  }

  // TODO Merge with useConfigStore when the backend routes have been merged.
  async function uploadConfig(id: string, configYaml: string) {
    await spin(
      api.uploadConfig("metadata", id, configYaml),
      `resource/${id}/metadata`,
    );

    await Promise.all([
      // Backend may modify uploaded config, so fetch the real one
      loadConfig(id, true),
      // Get new title
      loadResource(id, true),
    ]);
  }

  return {
    configs: readonly(configs),
    metadatas: readonly(metadatas),
    loadConfig,
    uploadConfig,
  };
});
