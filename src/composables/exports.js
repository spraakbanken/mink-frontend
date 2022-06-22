import { computed } from "@vue/reactivity";
import { downloadExports, getExports, downloadExportFile } from "@/assets/api";
import useSpin from "@/assets/spin";
import { useStore } from "vuex";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useI18n } from "vue-i18n";

export default function useExports() {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId } = useCorpusIdParam();
  const { t } = useI18n();
  const exports = computed(() => store.state.corpora[corpusId.value]?.exports);
  const token = computed(() => `corpus/${corpusId.value}/exports`);

  function loadExports() {
    const corpusIdFixed = corpusId.value;
    spin(getExports(corpusIdFixed), t("exports.loading"), token.value).then(
      (exports) =>
        store.commit("setExports", { corpusId: corpusIdFixed, exports })
    );
  }

  function downloadResult() {
    return spin(
      downloadExports(corpusId.value),
      "Laddar ner analysresultat",
      token.value
    );
  }

  function downloadResultFile(fileName) {
    return spin(
      downloadExportFile(corpusId.value, fileName),
      "Laddar ner analysresultat",
      token.value
    );
  }

  return {
    loadExports,
    exports,
    downloadResult,
    downloadResultFile,
  };
}
