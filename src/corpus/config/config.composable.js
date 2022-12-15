import { computed } from "vue";
import { useStore } from "vuex";
import {
  emptyConfig,
  FORMATS_EXT,
  makeConfig,
  parseConfig,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";

export default function useConfig(corpusId) {
  const store = useStore();
  const { th } = useLocale();
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

  async function uploadConfig(config, corpusId_ = corpusId) {
    await mink.saveConfig(corpusId_, makeConfig(corpusId_, config));
    store.commit("setConfig", { corpusId: corpusId_, config });
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
