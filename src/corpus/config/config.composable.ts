import { computed } from "vue";
import {
  makeConfig,
  parseConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

export default function useConfig(corpusId: string) {
  const resourceStore = useResourceStore();
  const { th } = useLocale();

  const corpus = computed(() => resourceStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
  const configOptions = computed(getParsedConfig);
  const corpusName = computed(() => th(configOptions.value?.name));

  async function uploadConfig(configOptions: ConfigOptions) {
    const configYaml = makeConfig(corpusId, configOptions);
    await resourceStore.uploadConfig(corpusId, configYaml);
  }

  function getParsedConfig() {
    if (!config.value) return undefined;
    try {
      const parsed = parseConfig(config.value);
      return parsed;
    } catch (error) {
      console.error(`Error parsing config for "${corpusId}":`, error);
    }
  }

  return {
    config,
    configOptions,
    corpusName,
    uploadConfig,
  };
}
