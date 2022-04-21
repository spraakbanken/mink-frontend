import { computed } from "vue";
import { useStore } from "vuex";
import { getConfig } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";

export default function useConfig() {
  const store = useStore();
  const { corpusId } = useCorpusIdParam();
  const config = computed(() => store.state.corpora[corpusId.value].config);

  function loadConfig(el = null) {
    spin(getConfig(corpusId.value), "Hämtar konfiguration", el).then((config) =>
      store.commit("setConfig", { corpusId: corpusId.value, config })
    );
  }

  return {
    config,
    loadConfig,
  };
}
