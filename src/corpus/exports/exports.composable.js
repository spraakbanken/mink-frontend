import { computed } from "vue";
import { downloadFile } from "@/util";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

export default function useExports(corpusId) {
  const corpusStore = useCorpusStore();
  const corpus = corpusStore.corpora[corpusId];
  const exports = computed(() => corpus?.exports);
  const mink = useMinkBackend();

  async function loadExports() {
    const exports = await mink.loadExports(corpusId);
    corpus.exports = exports;
  }

  async function downloadResult() {
    const data = await mink.downloadExports(corpusId);
    downloadFile(data, corpusId + ".zip");
  }

  async function downloadResultFile(path) {
    const data = await mink.downloadExportFiles(corpusId, path);
    const filename = path.split("/").pop();
    downloadFile(data, filename);
  }

  return {
    loadExports,
    exports,
    downloadResult,
    downloadResultFile,
  };
}
