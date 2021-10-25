import { computed } from "@vue/reactivity";
import { downloadExports, getExports } from "@/assets/api";
import { spin } from "@/assets/spin";
import { useStore } from "vuex";
import useCorpusIdParam from '@/composables/corpusIdParam'

export default function useExports() {
  const store = useStore();
  const { corpusId } = useCorpusIdParam();
  const exports = computed(() => store.state.corpora[corpusId]?.exports);

  function loadExports(el = null) {
    spin(getExports(corpusId), "Listar resultatfiler", el).then((exports) =>
      store.commit("setExports", { corpusId, exports })
    );
  }

  function downloadResult(el = null) {
    spin(downloadExports(corpusId), "Laddar ner analysresultat", el);
  }

  return {
    loadExports,
    exports,
    downloadResult,
  };
}
