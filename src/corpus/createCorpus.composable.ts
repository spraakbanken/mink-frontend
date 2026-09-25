import { useSparv } from "./sparv.composable";
import { getFilenameExtension } from "@/util";
import { makeConfig, type CorpusSourceFormat } from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";
import useLocale from "@/i18n/locale.composable";

export default function useCreateCorpus() {
  const { createResource } = useCreateResource();
  const { defaultConfig } = useSparv();
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

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
