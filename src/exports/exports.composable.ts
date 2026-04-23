import { useMatomo } from "vue3-matomo";
import api from "@/api/api";
import type { ResourceType } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";
import { downloadFile } from "@/util";

export default function useExports(type: ResourceType, id: string) {
  const { spin } = useSpin();
  const matomo = useMatomo();

  async function downloadResult() {
    matomo.value?.trackEvent("Corpus", "Download", "Export archive");
    const data = await spin(
      api.downloadExports(type, id),
      `${id}/exports/download`,
    );
    downloadFile(data, getDownloadFilename());
  }

  async function downloadResultFile(path: string) {
    const filename = path.split("/").pop()!;
    matomo.value?.trackEvent("Corpus", "Download", "Export file");
    const data = await loadResultFile(path);
    downloadFile(data, filename);
  }

  function getDownloadFilename() {
    return id + ".zip";
  }

  async function loadResultFile(path: string) {
    return spin(
      api.downloadExportFile(type, id, path),
      `${id}/exports/${path}`,
    );
  }

  return {
    downloadResult,
    downloadResultFile,
    getDownloadFilename,
    loadResultFile,
  };
}
