import { computed } from "@vue/reactivity";
import { downloadExports, getExports } from "@/assets/api";
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
    spin(
      downloadExports(corpusId.value),
      "Laddar ner analysresultat",
      token.value
    );
  }

  return {
    loadExports,
    exports,
    downloadResult,
  };
}
