import { useRouter } from "vue-router";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";
import useDeleteCorpus from "./deleteCorpus.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type FileFormat,
  type ConfigOptions,
} from "@/api/corpusConfig";
import type { AxiosError } from "axios";
import type { MinkResponse } from "@/api/api.types";
import useCreateResource from "@/resource/createResource.composable";

export default function useCreateCorpus() {
  const resourceStore = useResourceStore();
  const router = useRouter();
  const { deleteCorpus } = useDeleteCorpus();
  const { alert, alertError } = useMessenger();
  const mink = useMinkBackend();
  const { addNewResource } = useCreateResource();

  async function createCorpus() {
    const corpusId = await mink.createCorpus().catch(alertError);
    if (!corpusId) return undefined;

    await addNewResource("corpus", corpusId);
    return corpusId;
  }

  async function createFromUpload(files: FileList) {
    const corpusId = await createCorpus().catch(alertError);
    if (!corpusId) return;

    // Get file extension of first file, assuming all are using the same extension.
    const format = getFilenameExtension(files[0]?.name) as FileFormat;

    // Create a minimal config.
    const config: ConfigOptions = {
      name: { swe: corpusId, eng: corpusId },
      format,
    };

    const results = await Promise.allSettled([
      uploadSources(files, corpusId),
      uploadConfig(config, corpusId),
    ]);

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

    router.push(`/library/corpus/${corpusId}`);
  }

  // Like the `uploadConfig` in `config.composable.ts` but takes `corpusId` as argument.
  async function uploadConfig(config: ConfigOptions, corpusId: string) {
    // This may throw, either from makeConfig or saveConfig.
    await mink.saveConfig(corpusId, await makeConfig(corpusId, config));
    resourceStore.corpora[corpusId].config = config;
  }

  // Like the `uploadSources` in `sources.composable.ts` but takes `corpusId` as argument.
  async function uploadSources(files: FileList, corpusId: string) {
    await mink.uploadSources(corpusId, files);
    const info = await mink.resourceInfoOne(corpusId).catch(alertError);
    if (!info) return;
    resourceStore.corpora[corpusId].sources = info.resource.source_files;
  }

  async function createFromConfig(
    name: string,
    description: string,
    format: FileFormat,
    textAnnotation?: string,
  ): Promise<string | undefined> {
    const config = {
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
      await uploadConfig(config, corpusId);
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
