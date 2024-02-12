import { useRouter } from "vue-router";
import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
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
import useCorpora from "@/corpora/corpora.composable";

export default function useCreateCorpus() {
  const corpusStore = useCorpusStore();
  const router = useRouter();
  const { refreshJwt } = useAuth();
  const { deleteCorpus } = useDeleteCorpus();
  const { alert, alertError } = useMessenger();
  const mink = useMinkBackend();
  const { refreshCorpora } = useCorpora();

  async function createCorpus() {
    const corpusId = await mink.createCorpus().catch(alertError);
    if (!corpusId) return undefined;
    // Have the new corpus included in further API calls.
    await refreshJwt();
    // Mark corpus store outdated. Instead of awaiting to have the ids present, add it manually below.
    refreshCorpora();
    // Adding the new id to store may trigger API calls, so do it after updating the JWT.
    corpusStore.corpora[corpusId] = corpusStore.corpora[corpusId] || {};
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

    router.push(`/corpus/${corpusId}`);
  }

  // Like the `uploadConfig` in `config.composable.ts` but takes `corpusId` as argument.
  async function uploadConfig(config: ConfigOptions, corpusId: string) {
    // This may throw, either from makeConfig or saveConfig.
    await mink.saveConfig(corpusId, await makeConfig(corpusId, config));
    corpusStore.corpora[corpusId].config = config;
  }

  // Like the `uploadSources` in `sources.composable.ts` but takes `corpusId` as argument.
  async function uploadSources(files: FileList, corpusId: string) {
    await mink.uploadSources(corpusId, files);
    const info = await mink.resourceInfoOne(corpusId).catch(alertError);
    if (!info) return;
    corpusStore.corpora[corpusId].sources = info.resource.source_files;
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
      router.push(`/corpus/${corpusId}`);
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
