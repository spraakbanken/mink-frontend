import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type CorpusSourceFormat,
  defaultConfig,
} from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";

export default function useCreateCorpus() {
  const { createResource } = useCreateResource();

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
    textAnnotation?: string,
  ) {
    const configOptions = {
      ...(await defaultConfig()),
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    return createResource("corpus", (id) => makeConfig(id, configOptions));
  }

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
