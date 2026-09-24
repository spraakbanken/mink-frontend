import { useSparv } from "./sparv.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type CorpusSourceFormat,
  emptyConfig,
} from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";
import useLocale from "@/i18n/locale.composable";

export default function useCreateCorpus() {
  const { createResource } = useCreateResource();
  const { loadDefaultAnnotations } = useSparv();
  const { createByLang } = useLocale();

  async function createCorpusFromUpload(files: File[]) {
    const annotations = await loadDefaultAnnotations();
    // Create default config.
    const configOptions = {
      ...emptyConfig(),
      annotations,
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
    const annotations = await loadDefaultAnnotations();
    const configOptions = {
      ...emptyConfig(),
      name: createByLang(name),
      description: createByLang(description),
      format,
      language,
      textAnnotation,
      annotations,
    };

    return createResource("corpus", (id) => makeConfig(id, configOptions));
  }

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
