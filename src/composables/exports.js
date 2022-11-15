import { computed } from "@vue/reactivity";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default function useExports(corpusId) {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();
  const exports = computed(() => store.state.corpora[corpusId]?.exports);
  const token = `corpus/${corpusId}/exports`;

  function loadExports() {
    spin(api.listExports(corpusId), t("exports.loading"), token).then(
      (exports) => store.commit("setExports", { corpusId, exports })
    );
  }

  function downloadResult() {
    return spin(
      api.downloadExports(corpusId),
      "Laddar ner analysresultat",
      token
    );
  }

  function downloadResultFile(fileName) {
    return spin(
      api.downloadExportFile(corpusId, fileName),
      "Laddar ner analysresultat",
      token
    );
  }

  return {
    loadExports,
    exports,
    downloadResult,
    downloadResultFile,
  };
}
