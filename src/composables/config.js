import { computed } from "vue";
import { useStore } from "vuex";
import { getConfig } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";

export default function useConfig() {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId } = useCorpusIdParam();
  const config = computed(() => store.state.corpora[corpusId.value].config);
  const token = computed(() => `corpus/${corpusId.value}/config`);

  function loadConfig() {
    spin(getConfig(corpusId.value), "Hämtar konfiguration", token.value).then(
      (config) =>
        store.commit("setConfig", { corpusId: corpusId.value, config })
    );
  }

  return {
    config,
    loadConfig,
  };
}