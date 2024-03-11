import { computed } from "vue";
import {
  emptyConfig,
  makeConfig,
  parseConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";

export default function useConfig(corpusId: string) {
  const resourceStore = useResourceStore();
  const { th } = useLocale();
  const mink = useMinkBackend();

  const corpus = computed(() => resourceStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
  const corpusName = computed(() => th(config.value?.name));

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      .then(parseConfig)
      // 404 means no config which is fine, rethrow other errors.
      .catch((error) => {
        if (error.response?.status == 404) return emptyConfig();
        throw error;
      });
    corpus.value.config = config;
  }

  async function uploadConfig(config: ConfigOptions) {
    // This may throw, either from makeConfig or saveConfig.
    await mink.saveConfig(corpusId, await makeConfig(corpusId, config));
    resourceStore.corpora[corpusId].config = config;
  }

  return {
    config,
    corpusName,
    loadConfig,
    uploadConfig,
  };
}
