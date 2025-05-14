import { computed } from "vue";
import {
  makeConfig,
  parseConfig,
  validateConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useLocale from "@/i18n/locale.composable";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import { getException } from "@/util";

export default function useConfig(corpusId: string) {
  const resourceStore = useResourceStore();
  const { th } = useLocale();
  const mink = useMinkBackend();

  const corpus = computed(() => resourceStore.corpora[corpusId]);
  const config = computed(() => corpus.value?.config);
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

  async function loadConfig() {
    const config = await mink
      .loadConfig(corpusId)
      // 404 means no config which is fine, rethrow other errors.
      .catch((error) => {
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    corpus.value.config = config;
  }

  async function uploadConfig(configOptions: ConfigOptions) {
    const configYaml = makeConfig(corpusId, configOptions);
    await uploadConfigRaw(configYaml);
  }

  async function uploadConfigRaw(configYaml: string) {
    await mink.saveConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    resourceStore.corpora[corpusId].config = configYaml;
    loadConfig();
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
    loadConfig,
    uploadConfig,
    uploadConfigRaw,
  };
}
