import { computed } from "vue";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import { useCorpusStore } from "@/store/corpus.store";
import { getException } from "@/util";

export default function useConfig(corpusId: string) {
  const corpusStore = useCorpusStore();
  const { th } = useLocale();

  const config = computed(() => corpusStore.corpora[corpusId]?.config);
  const configOptions = computed(getParsedConfig);
  const corpusName = computed(() => th(configOptions.value?.name));
  const hasMetadata = computed(
    () => configOptions.value?.name?.swe || configOptions.value?.name?.eng,
  );
  const isConfigValid = computed(
    () =>
      configOptions.value &&
      !getException(() => validateConfig(configOptions.value!)),
  );

  async function saveConfigOptions(configOptions: ConfigOptions) {
    const configYaml = makeConfig(corpusId, configOptions);
    await corpusStore.uploadConfig(corpusId, configYaml);
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
    hasMetadata,
    isConfigValid,
    saveConfigOptions,
  };
}
