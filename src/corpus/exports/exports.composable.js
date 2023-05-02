import { computed } from "vue";
import { downloadFile } from "@/util";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

export default function useExports(corpusId) {
  const corpusStore = useCorpusStore();
  const corpus = corpusStore.corpora[corpusId];
  const exports = computed(() => corpus?.exports);
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  async function loadExports() {
    const exports = await mink.loadExports(corpusId).catch(alertError);
    corpus.exports = exports;
  }

  async function downloadResult() {
    const data = await mink.downloadExports(corpusId).catch(alertError);
    downloadFile(data, getDownloadFilename());
  }

  function getDownloadFilename() {
    return corpusId + ".zip";
  }

  async function downloadResultFile(path) {
    const data = await mink
      .downloadExportFiles(corpusId, path)
      .catch(alertError);
    const filename = path.split("/").pop();
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
