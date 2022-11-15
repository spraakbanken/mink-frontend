import { computed } from "vue";
import { useStore } from "vuex";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import {
  FORMATS_EXT,
  makeConfig,
  emptyConfig,
  parseConfig,
} from "@/assets/corpusConfig";
import useTh from "./th";
import { useI18n } from "vue-i18n";

export default function useConfig(corpusId) {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();
  const { th } = useTh();

  const config = computed(() => store.state.corpora[corpusId]?.config);
  const token = computed(() => `corpus/${corpusId}/config`);
  const corpusName = computed(() => config.value && th(config.value.name));

  function loadConfig() {
    return spin(api.downloadConfig(corpusId), t("config.loading"), token.value)
      .catch((error) => {
        // Save empty config.
        if (error.response?.status == 404) {
          store.commit("setConfig", {
            corpusId,
            config: emptyConfig(),
          });
        }
      })
      .then((configYaml) => {
        const config = parseConfig(configYaml);
        store.commit("setConfig", { corpusId, config });
      });
  }

  async function uploadConfig(config, corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId;
    const configYaml = makeConfig(corpusIdFixed, config);
    await spin(
      api.uploadConfig(corpusIdFixed, configYaml),
      t("corpus.configuring"),
      token.value
    );
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
