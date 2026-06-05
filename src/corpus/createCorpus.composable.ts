import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type CorpusSourceFormat,
  emptyConfig,
  type ConfigOptions,
} from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";
import { useSparvAnalyses } from "@/api/useSparvAnalyses";
import useLocale from "@/i18n/locale.composable";
import { useAppConfig } from "@/app/useAppConfig";

export default function useCreateCorpus() {
  const { corpusSettings } = useAppConfig();
  const { createResource } = useCreateResource();
  const { analyses } = useSparvAnalyses();
  const { createByLang } = useLocale();

  async function createCorpusFromUpload(files: File[]) {
    // Create default config.
    const configOptions = {
      ...(await defaultConfig()),
      // Get file extension of first file, assuming all are using the same extension.
      format: getFilenameExtension(files[0].name) as CorpusSourceFormat,
    };

    return createResource(
      "corpus",
      (id) => makeConfig(id, configOptions),
      files,
    );
  }

  async function createCorpus(
    name: string,
    description: string,
    format: CorpusSourceFormat,
    language: string,
    textAnnotation?: string,
  ) {
    const configOptions = {
      ...(await defaultConfig()),
      name: createByLang(name),
      description: createByLang(description),
      format,
      language,
      textAnnotation,
    };

    return createResource("corpus", (id) => makeConfig(id, configOptions));
  }

  /** Config with default values */
  async function defaultConfig(): Promise<ConfigOptions> {
    const config = emptyConfig();

    // Analyses to exclude from default selection
    const defaultDisabled = corpusSettings.analyses?.defaultDisabled || [];

    config.annotations = (analyses.value || [])
      .filter((analysis) => !defaultDisabled.includes(analysis.id))
      .flatMap((analysis) => analysis.annotations);

    return config;
  }

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
