import { computed } from "vue";
import { emptyConfig, makeConfig, parseConfig } from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

export default function useConfig(corpusId) {
  const corpusStore = useCorpusStore();
  const { th } = useLocale();
  const mink = useMinkBackend();

  const corpus = corpusStore.corpora[corpusId];
  const config = computed(() => corpus?.config);
  const corpusName = computed(() => th(config.value?.name));

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      .then(parseConfig)
      .catch((error) => {
        if (error.response?.status == 404) return emptyConfig();
        throw error;
      });
    corpus.config = config;
  }

  async function uploadConfig(config, corpusId_ = corpusId) {
    await mink.saveConfig(corpusId_, makeConfig(corpusId_, config));
    corpusStore.corpora[corpusId_].config = config;
  }

  return {
    config,
    corpusName,
    loadConfig,
    uploadConfig,
  };
}
