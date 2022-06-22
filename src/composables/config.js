import { computed } from "vue";
import { useStore } from "vuex";
import { getConfig } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { makeConfig, parseConfig } from "@/assets/corpusConfig";
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
    return spin(getConfig(corpusId.value), t("config.loading"), token.value)
      .then((configYaml) => {
        const config = parseConfig(configYaml);
        store.commit("setConfig", { corpusId: corpusId.value, config });
      })
      .catch((error) => {
        // Save empty config.
        if (error.response?.status == 404) {
          store.commit("setConfig", {
            corpusId: corpusId.value,
            config: parseConfig(
              makeConfig(corpusId.value, {
                name: { swe: "", eng: "" },
                description: { swe: "", eng: "" },
              })
            ),
          });
        }
      });
  }

  return {
    config,
    loadConfig,
    corpusName,
  };
}
