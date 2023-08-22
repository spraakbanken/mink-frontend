import { computed } from "vue";
import { emptyConfig, makeConfig, parseConfig } from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

export default function useConfig(corpusId) {
  const corpusStore = useCorpusStore();
  const { th } = useLocale();
  const mink = useMinkBackend();

  const corpus = computed(() => corpusStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
  const corpusName = computed(() => th(config.value?.name));

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      .then(parseConfig)
      .catch((error) => {
        if (error.response?.status == 404) return emptyConfig();
        throw error;
      });
    corpus.value.config = config;
  }

  async function uploadConfig(config, corpusId_ = corpusId) {
    // This may throw, either from makeConfig or saveConfig.
    await mink.saveConfig(corpusId_, await makeConfig(corpusId_, config));
    corpusStore.corpora[corpusId_].config = config;
  }

  return {
    config,
    corpusName,
    loadConfig,
    uploadConfig,
  };
}
