import { defineStore } from "pinia";
import { reactive, readonly } from "vue";
import useSpin from "@/spin/spin.composable";
import type { FileMeta } from "@/api/api.types";
import api from "@/api/api";

export const useExportStore = defineStore("export", () => {
  const { spin } = useSpin();

  /** Export files by resource id */
  const exports = reactive<Record<string, FileMeta[]>>({});

  /** Load export files of a resource */
  async function loadExports(
    id: string,
    skipCache = false,
  ): Promise<FileMeta[]> {
    if (skipCache || !exports[id]) {
      const files = await spin(api.listExports(id), `${id}/exports/list`);
      // Sort alphabetically by path, but "stats_*" first
      exports[id] = files
        .sort((a, b) => a.path.localeCompare(b.path))
        .sort((a, b) => b.path.indexOf("stats_") - a.path.indexOf("stats_"));
    }
    return exports[id];
  }

  return {
    exports: readonly(exports),
    loadExports,
  };
});
