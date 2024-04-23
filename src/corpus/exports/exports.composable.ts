import { computed } from "vue";
import { downloadFile } from "@/util";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";

export default function useExports(corpusId: string) {
  const resourceStore = useResourceStore();
  const corpus = computed(() => resourceStore.corpora[corpusId]);
  /** Exports sorted alphabetically by path, but "stats_*" first. */
  const exports = computed(() =>
    // Shallow-clone list to avoid modifying the computed value.
    [...(corpus.value?.exports || [])]
      ?.sort((a, b) => a.path.localeCompare(b.path))
      .sort((a, b) => b.path.indexOf("stats_") - a.path.indexOf("stats_")),
  );
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  async function loadExports() {
    const exports = await mink.loadExports(corpusId).catch(alertError);
    corpus.value.exports = exports;
  }

  async function downloadResult() {
    const data = await mink.downloadExports(corpusId).catch(alertError);
    if (!data) return;
    downloadFile(data, getDownloadFilename());
  }

  function getDownloadFilename() {
    return corpusId + ".zip";
  }

  async function downloadResultFile(path: string) {
    const data = await mink
      .downloadExportFiles(corpusId, path)
      .catch(alertError);
    if (!data) return;
    const filename = path.split("/").pop()!;
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
