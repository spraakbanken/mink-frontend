import { useRouter } from "vue-router";
import useDeleteCorpus from "./deleteCorpus.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type FileFormat,
  type ConfigOptions,
  defaultConfig,
} from "@/api/corpusConfig";
import api from "@/api/api";
import { useAuth } from "@/auth/auth.composable";
import { useConfigStore } from "@/store/config.store";

export default function useCreateCorpus() {
  const { refreshAuth } = useAuth();
  const { uploadConfig } = useConfigStore();
  const router = useRouter();
  const { deleteCorpus } = useDeleteCorpus();

  async function createFromUpload(files: File[]) {
    if (!files[0]) throw new RangeError("No files");
    const id = await api.createCorpus();
    // Have the new corpus included in further API calls.
    await refreshAuth();

    // Create default config.
    const config = await defaultConfig();

    // Get file extension of first file, assuming all are using the same extension.
    config.format = getFilenameExtension(files[0].name) as FileFormat;

    // Wait for sources and config to be uploaded in parallel.
    const results = await Promise.allSettled([
      api.uploadSources(id, files),
      saveConfigOptions(config, id),
    ]);

    // If any error, abort and delete the corpus draft.
    const rejections = results.filter(
      (result): result is PromiseRejectedResult => result.status != "fulfilled",
    );
    if (rejections.length) {
      // Discard the empty corpus.
      await deleteCorpus(id);

      // Throw one or multiple errors
      if (rejections.length == 1) throw rejections[0].reason;
      throw new AggregateError(rejections.map((result) => result.reason));
    }

    // Visit new corpus when successfully created.
    router.push(`/library/corpus/${id}`);
  }

  // Like the `saveConfigOptions` in `corpus.composable.ts` but takes `id` as argument.
  async function saveConfigOptions(configOptions: ConfigOptions, id: string) {
    const configYaml = makeConfig(id, configOptions);
    await uploadConfig(id, configYaml);
  }

  async function createFromConfig(
    name: string,
    description: string,
    format: FileFormat,
    textAnnotation?: string,
  ) {
    const config = {
      ...(await defaultConfig()),
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    // Create an empty corpus. If it fails, abort.
    const id = await api.createCorpus();
    // Have the new corpus included in further API calls.
    await refreshAuth();

    // Upload the basic config.
    try {
      await saveConfigOptions(config, id);
    } catch (e) {
      // Discard the empty corpus.
      await deleteCorpus(id);
      // Rethrow error
      throw e;
    }

    // Show the created corpus.
    router.push(`/library/corpus/${id}`);
  }

  return {
    createFromUpload,
    createFromConfig,
  };
}
