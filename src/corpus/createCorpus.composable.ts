import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type CorpusSourceFormat,
  defaultConfig,
} from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";
import { useAnalysisRegistry } from "@/analyses/useAnalysisRegistry";

export default function useCreateCorpus() {
  const { createResource } = useCreateResource();
  const analysisRegistry = useAnalysisRegistry();

  async function createCorpusFromUpload(files: File[]) {
    // Create default config.
    const configOptions = {
      ...(await defaultConfig(analysisRegistry)),
      // Get file extension of first file, assuming all are using the same extension.
      format: getFilenameExtension(files[0].name) as CorpusSourceFormat,
    };

    return createResource(
      "corpus",
      (id) => makeConfig(id, configOptions, analysisRegistry),
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
      ...(await defaultConfig(analysisRegistry)),
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    return createResource("corpus", (id) =>
      makeConfig(id, configOptions, analysisRegistry),
    );
  }

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
