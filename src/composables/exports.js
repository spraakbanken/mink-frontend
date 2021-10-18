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

  function loadExports() {
    spin(getExports(corpusId), "Listar resultatfiler").then((exports) =>
      store.commit("setExports", { corpusId, exports })
    );
  }

  function downloadResult() {
    spin(downloadExports(corpusId), "Laddar ner analysresultat");
  }

  return {
    loadExports,
    exports,
    downloadResult,
  };
}
