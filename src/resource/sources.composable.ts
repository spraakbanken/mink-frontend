import { storeToRefs } from "pinia";
import { computed } from "vue";
import { uniq } from "es-toolkit";
import api from "@/api/api";
import type { FileMeta, ProgressHandler, ResourceType } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";
import { useResourceStore } from "@/store/resource.store";
import { getFilenameExtension } from "@/util";

export default function useSources(type: ResourceType, id: string) {
  const { spin } = useSpin();
  const resourceStore = useResourceStore();
  const { loadResource } = resourceStore;
  const { resources } = storeToRefs(resourceStore);

  const sources = computed(() => resources.value[id]?.sources || []);

  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      sources.value.map((source) => getFilenameExtension(source.name)) || [],
    ),
  );

  async function downloadSource(source: FileMeta, binary: boolean) {
    return spin(
      api.downloadSources(type, id, source.name, binary),
      `${id}/sources/${source.name}`,
    );
  }

  async function uploadSources(files: File[], onProgress?: ProgressHandler) {
    await spin(
      api.uploadSources(type, id, files, onProgress),
      `${id}/sources/upload`,
    );
    loadResource(id, true);
  }

  async function deleteSource(source: FileMeta) {
    await spin(api.removeSource(type, id, source.name), `${id}/sources/list`);
    loadResource(id, true);
  }

  return {
    sources,
    extensions,
    downloadSource,
    uploadSources,
    deleteSource,
  };
}
