import { computed } from "vue";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import { getException } from "@/util";

export default function useConfig(corpusId: string) {
  const resourceStore = useResourceStore();
  const { th } = useLocale();

  const config = computed(() => resourceStore.corpora[corpusId]?.config);
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
    hasMetadata,
    isConfigValid,
    saveConfigOptions,
  };
}
