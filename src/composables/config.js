import { computed } from "vue";
import { useStore } from "vuex";
import {
  emptyConfig,
  FORMATS_EXT,
  makeConfig,
  parseConfig,
} from "@/assets/corpusConfig";
import useTh from "./th";
import useMinkBackend from "./backend";

export default function useConfig(corpusId) {
  const store = useStore();
  const { th } = useTh();
  const mink = useMinkBackend();

  const config = computed(() => store.state.corpora[corpusId]?.config);
  const corpusName = computed(() => config.value && th(config.value.name));

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      .then(parseConfig)
      .catch((error) => {
        if (error.response?.status == 404) return emptyConfig();
        throw error;
      });
    store.commit("setConfig", { corpusId, config });
  }

  async function uploadConfig(config, corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId;
    await mink.saveConfig(corpusIdFixed, makeConfig(corpusIdFixed, config));
    store.commit("setConfig", { corpusId: corpusIdFixed, config });
  }

  const isConfigValid = computed(
    () =>
      config.value &&
      FORMATS_EXT.includes(config.value.format) &&
      (config.value.name?.swe || config.value.name?.eng)
  );

  return {
    config,
    corpusName,
    isConfigValid,
    loadConfig,
    uploadConfig,
  };
}
