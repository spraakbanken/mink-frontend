import { useRouter } from "vue-router";
import { useCorpusStore } from "@/store/corpus.store";
import useDeleteCorpus from "@/corpus/deleteCorpus.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type FileFormat,
  type ConfigOptions,
  defaultConfig,
} from "@/api/corpusConfig";
import useCreateResource from "@/resource/createResource.composable";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";

export default function useCreateCorpus() {
  const corpusStore = useCorpusStore();
  const router = useRouter();
  const { deleteCorpus } = useDeleteCorpus();
  const { spin } = useSpin();
  const { addNewResource } = useCreateResource();

  async function createCorpus() {
    const corpusId = await spin(api.createCorpus(), "create");
    await addNewResource(corpusId);
    return corpusId;
  }

  async function createFromUpload(files: File[]) {
    if (!files[0]) throw new RangeError("No files");
    const corpusId = await createCorpus();

    // Create default config.
    const config = await defaultConfig();

    // Get file extension of first file, assuming all are using the same extension.
    config.format = getFilenameExtension(files[0].name) as FileFormat;

    // Wait for sources and config to be uploaded in parallel.
    const results = await Promise.allSettled([
      api.uploadSources(corpusId, files),
      saveConfigOptions(config, corpusId),
    ]);

    // If any error, abort and delete the corpus draft.
    const rejections = results.filter(
      (result): result is PromiseRejectedResult => result.status != "fulfilled",
    );
    if (rejections.length) {
      // Discard the empty corpus.
      await deleteCorpus(corpusId);

      // Throw one or multiple errors
      if (rejections.length == 1) throw rejections[0].reason;
      throw new AggregateError(rejections.map((result) => result.reason));
    }

    // Visit new corpus when successfully created.
    router.push(`/library/corpus/${corpusId}`);

    // Refresh sources in background
    spin(
      corpusStore.loadSources(corpusId, true),
      `corpus/${corpusId}/sources/list`,
    );
  }

  // Like the `saveConfigOptions` in `corpus.composable.ts` but takes `corpusId` as argument.
  async function saveConfigOptions(
    configOptions: ConfigOptions,
    corpusId: string,
  ) {
    const configYaml = makeConfig(corpusId, configOptions);
    await corpusStore.uploadConfig(corpusId, configYaml);
  }

  async function createFromConfig(
    name: string,
    description: string,
    format: FileFormat,
    textAnnotation?: string,
  ): Promise<string | undefined> {
    const config = {
      ...(await defaultConfig()),
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    // Create an empty corpus. If it fails, abort.
    const corpusId = await createCorpus();

    // Upload the basic config.
    try {
      await saveConfigOptions(config, corpusId);
    } catch (e) {
      // Discard the empty corpus.
      await deleteCorpus(corpusId);
      // Rethrow error
      throw e;
    }

    // Show the created corpus.
    router.push(`/library/corpus/${corpusId}`);
    return corpusId;
  }

  return {
    createFromUpload,
    createFromConfig,
  };
}
