import { computed } from "vue";
import { useStore } from "vuex";
import { getConfig } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { parseConfig } from "@/assets/corpusConfig";
import useTh from "./th";

export default function useConfig(corpusIdArg) {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId: corpusIdParam } = useCorpusIdParam();
  const corpusId = corpusIdArg ? computed(() => corpusIdArg) : corpusIdParam;

  const { th } = useTh();

  const config = computed(() => store.state.corpora[corpusId.value].config);
  const token = computed(() => `corpus/${corpusId.value}/config`);
  const corpusName = computed(() =>
    config.value ? th(config.value.name) : corpusId.value
  );

  function loadConfig() {
    return spin(
      getConfig(corpusId.value),
      "Hämtar konfiguration",
      token.value
    ).then((configYaml) => {
      const config = parseConfig(configYaml);
      store.commit("setConfig", { corpusId: corpusId.value, config });
    });
  }

  return {
    config,
    loadConfig,
    corpusName,
  };
}
