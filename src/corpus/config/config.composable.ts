import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  emptyConfig,
  makeConfig,
  parseConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";

export default function useConfig(corpusId: string) {
  const resourceStore = useResourceStore();
  const { t } = useI18n();
  const { th } = useLocale();
  const mink = useMinkBackend();
  const { alert } = useMessenger();

  const corpus = computed(() => resourceStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
  const corpusName = computed(() => th(config.value?.name));

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      .then(async (yaml: string) => {
        try {
          return await parseConfig(yaml);
        } catch (e) {
          console.error(`Parsing config failed: ${e}`);
          alert(t("corpus.config.parse.error"));
          return undefined;
        }
      })
      // 404 means no config which is fine, rethrow other errors.
      .catch((error) => {
        if (error.response?.status == 404) return undefined;
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
