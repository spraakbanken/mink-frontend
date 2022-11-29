import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useMinkBackend from "./backend";
import { downloadFile } from "@/util";

export default function useExports(corpusId) {
  const store = useStore();
  const exports = computed(() => store.state.corpora[corpusId]?.exports);
  const mink = useMinkBackend();

  async function loadExports() {
    const exports = await mink.loadExports(corpusId);
    store.commit("setExports", { corpusId, exports });
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
