import { useRouter } from "vue-router";
import type { AxiosError } from "axios";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import useDeleteCorpus from "@/corpus/deleteCorpus.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type FileFormat,
  type ConfigOptions,
  emptyConfig,
} from "@/api/corpusConfig";
import type { MinkResponse } from "@/api/api.types";
import useCreateResource from "@/resource/createResource.composable";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";

export default function useCreateCorpus() {
  const corpusStore = useCorpusStore();
  const router = useRouter();
  const { deleteCorpus } = useDeleteCorpus();
  const { alert, alertError } = useMessenger();
  const { spin } = useSpin();
  const { addNewResource } = useCreateResource();

  async function createCorpus() {
    const corpusId = await spin(api.createCorpus(), "create");
    if (!corpusId) return undefined;

    await addNewResource("corpus", corpusId);
    return corpusId;
  }

  async function createFromUpload(files: File[]) {
    if (!files[0]) throw new RangeError("No files");
    const corpusId = await createCorpus().catch(alertError);
    if (!corpusId) return;

    // Get file extension of first file, assuming all are using the same extension.
    const format = getFilenameExtension(files[0].name) as FileFormat;

    // Create a minimal config.
    const config = {
      ...emptyConfig(),
      name: { swe: corpusId, eng: corpusId },
      format,
    };

    // Wait for sources and config to be uploaded in parallel.
    const results = await Promise.allSettled([
      api.uploadSources(corpusId, files),
      saveConfigOptions(config, corpusId),
    ]);

    // If any error, abort and delete the corpus draft.
    const rejectedResults = results.filter(
      (result): result is PromiseRejectedResult => result.status != "fulfilled",
    );
    if (rejectedResults.length) {
      // Display error message(s).
      rejectedResults.forEach((result) => alertError(result.reason));
      // Discard the empty corpus.
      await deleteCorpus(corpusId).catch(alertError);
      return;
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
      ...emptyConfig(),
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    // Create an empty corpus. If it fails, abort.
    const corpusId = await createCorpus().catch(alertError);
    if (!corpusId) return;

    // Upload the basic config.
    try {
      await saveConfigOptions(config, corpusId);
      // Show the created corpus.
      router.push(`/library/corpus/${corpusId}`);
      return corpusId;
    } catch (e) {
      // If creating the config fails, there's a TypeError.
      if (e instanceof TypeError) alert(e.message, "error");
      // Otherwise it's probably a backend error when saving.
      else alertError(e as AxiosError<MinkResponse>);
      // Discard the empty corpus.
      await deleteCorpus(corpusId).catch(alertError);
    }
  }

  return {
    createFromUpload,
    createFromConfig,
  };
}
