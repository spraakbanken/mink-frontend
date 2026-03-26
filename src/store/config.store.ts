import { defineStore } from "pinia";
import { reactive, readonly } from "vue";
import { useResourceStore } from "./resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export const useConfigStore = defineStore("config", () => {
  const { loadResource } = useResourceStore();
  const { spin } = useSpin();

  /** Config YAML strings by resource id */
  const configs = reactive<Record<string, string | undefined>>({});

  /** Fetch and store the config of a resource. */
  async function loadConfig(
    id: string,
    skipCache = false,
  ): Promise<string | undefined> {
    if (skipCache || !configs[id]) {
      const config = await spin(api.downloadConfig(id), `${id}/config`);
      configs[id] = config;
    }
    return configs[id];
  }

  async function uploadConfig(id: string, configYaml: string) {
    await spin(api.uploadConfig(id, configYaml), `${id}/config`);

    await Promise.all([
      // Backend may modify uploaded config, so fetch the real one
      loadConfig(id, true),
      // Get new title
      loadResource(id, true),
    ]);
  }

  return {
    configs: readonly(configs),
    loadConfig,
    uploadConfig,
  };
});
