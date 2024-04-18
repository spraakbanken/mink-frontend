import { computed } from "vue";
import { computedAsync } from "@vueuse/core";
import {
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
  const configOptions = computedAsync(getParsedConfig);
  const corpusName = computed(() => th(configOptions.value?.name));

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
    const configYaml = await makeConfig(corpusId, configOptions);
    await uploadConfigRaw(configYaml);
  }

  async function uploadConfigRaw(configYaml: string) {
    await mink.saveConfig(corpusId, configYaml);
    // Backend may modify uploaded config. Store our version immediately, but also fetch the real one unawaited.
    resourceStore.corpora[corpusId].config = configYaml;
    loadConfig();
  }

  async function getParsedConfig() {
    if (!config.value) return undefined;
    try {
      const parsed = await parseConfig(config.value);
      return parsed;
    } catch (error) {
      console.error(`Error parsing config for "${corpusId}":`, error);
    }
  }

  return {
    config,
    configOptions,
    corpusName,
    loadConfig,
    uploadConfig,
    uploadConfigRaw,
  };
}
