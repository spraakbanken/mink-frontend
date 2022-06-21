import { computed } from "@vue/reactivity";
import {
  downloadExports,
  getExports,
  getContentViewX,
  downloadExportFileXML,
  downloadSourceText,
} from "@/assets/api";
import useSpin from "@/assets/spin";
import { useStore } from "vuex";
import useCorpusIdParam from "@/composables/corpusIdParam";

export default function useExports() {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId } = useCorpusIdParam();
  const exports = computed(() => store.state.corpora[corpusId.value]?.exports);
  const token = computed(() => `corpus/${corpusId.value}/exports`);

  function loadExports() {
    spin(getExports(corpusId.value), "Listar resultatfiler", token.value).then(
      (exports) =>
        store.commit("setExports", { corpusId: corpusId.value, exports })
    );
  }

  function downloadResult() {
    return spin(
      downloadExports(corpusId.value),
      "Laddar ner analysresultat",
      token.value
    );
  }

  function downloadFileXML(fileName) {
    return spin(
      downloadExportFileXML(corpusId.value, fileName),
      "Laddar ner analysresultat",
      token.value
    );
  }

  function downloadFileTxt(fileName) {
    return spin(
      downloadSourceText(corpusId.value, fileName),
      "Laddar ner ren källtext",
      token.value
    );
  }

  function contentViewX(fileName) {
    return spin(
      getContentViewX(corpusId.value, fileName),
      "Laddar ner text",
      token.value
    ).then((data) => {
      store.commit("showText", { content: data });
    });
  }

  return {
    loadExports,
    exports,
    downloadResult,
    downloadFileXML,
    downloadFileTxt,
    contentViewX,
  };
}
