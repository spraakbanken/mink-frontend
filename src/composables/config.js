import { computed } from "vue";
import { useStore } from "vuex";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import {
  FORMATS_EXT,
  makeConfig,
  makeEmptyConfig,
  parseConfig,
} from "@/assets/corpusConfig";
import useTh from "./th";
import { useI18n } from "vue-i18n";

export default function useConfig(corpusIdArg) {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId: corpusIdParam } = useCorpusIdParam();
  const corpusId = corpusIdArg ? computed(() => corpusIdArg) : corpusIdParam;
  const { t } = useI18n();
  const { th } = useTh();

  const config = computed(() => store.state.corpora[corpusId.value]?.config);
  const token = computed(() => `corpus/${corpusId.value}/config`);
  const corpusName = computed(() => config.value && th(config.value.name));

  function loadConfig() {
    const corpusIdFixed = corpusId.value;
    return spin(
      api.downloadConfig(corpusIdFixed),
      t("config.loading"),
      token.value
    )
      .catch((error) => {
        // Save empty config.
        if (error.response?.status == 404) {
          store.commit("setConfig", {
            corpusId: corpusIdFixed,
            config: parseConfig(makeEmptyConfig()),
          });
        }
      })
      .then((configYaml) => {
        const config = parseConfig(configYaml);
        store.commit("setConfig", { corpusId: corpusIdFixed, config });
      });
  }

  async function uploadConfig(config) {
    const corpusIdFixed = corpusId.value;
    const configYaml = makeConfig(corpusIdFixed, config);
    await spin(
      api.uploadConfig(corpusIdFixed, configYaml),
      t("corpus.configuring"),
      token.value
    );
    store.commit("setConfig", { corpusIdFixed, config });
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
