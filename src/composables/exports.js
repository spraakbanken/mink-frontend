import { computed } from "@vue/reactivity";
import { downloadExports, getExports } from "@/assets/api";
import { spin } from "@/assets/spin";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default function useExports() {
  const store = useStore();
  const route = useRoute();
  const corpusId = route.params.corpusId;
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
