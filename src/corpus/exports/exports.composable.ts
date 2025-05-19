import { computed } from "vue";
import { downloadFile } from "@/util";
import { useMatomo } from "@/matomo";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";

export default function useExports(corpusId: string) {
  const resourceStore = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  /** Exports sorted alphabetically by path, but "stats_*" first. */
  const exports = computed(() =>
    // Shallow-clone list to avoid modifying the computed value.
    [...(resourceStore.corpora[corpusId]?.exports || [])]
      ?.sort((a, b) => a.path.localeCompare(b.path))
      .sort((a, b) => b.path.indexOf("stats_") - a.path.indexOf("stats_")),
  );

  async function loadExports() {
    const exports = await mink.loadExports(corpusId).catch(alertError);
    resourceStore.corpora[corpusId].exports = exports;
  }

  async function downloadResult() {
    matomo?.trackEvent("Corpus", "Download", "Export archive");
    const data = await mink.downloadExports(corpusId).catch(alertError);
    if (!data) return;
    downloadFile(data, getDownloadFilename());
  }

  function getDownloadFilename() {
    return corpusId + ".zip";
  }

  async function downloadResultFile(path: string) {
    const filename = path.split("/").pop()!;
    matomo?.trackEvent("Corpus", "Download", "Export file");
    const data = await mink
      .downloadExportFiles(corpusId, path)
      .catch(alertError);
    if (!data) return;
    downloadFile(data, filename);
  }

  return {
    loadExports,
    exports,
    downloadResult,
    downloadResultFile,
    getDownloadFilename,
  };
}
