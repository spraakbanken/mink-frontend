import { useRouter } from "vue-router";
import useDeleteResource from "@/resource/deleteResource.composable";
import { getFilenameExtension } from "@/util";
import {
  makeConfig,
  type CorpusSourceFormat,
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
  const { deleteResource } = useDeleteResource();

  async function createCorpusFromUpload(files: File[]) {
    const id = await api.createCorpus();
    // Have the new corpus included in further API calls.
    await refreshAuth();

    // Create default config.
    const config = await defaultConfig();

    // Get file extension of first file, assuming all are using the same extension.
    config.format = getFilenameExtension(files[0].name) as CorpusSourceFormat;

    // Wait for sources and config to be uploaded in parallel.
    try {
      await Promise.all([
        api.uploadSources("corpus", id, files),
        saveConfigOptions(config, id),
      ]);
      // Visit new corpus when successfully created.
      router.push(`/library/corpus/${id}`);
    } catch (error) {
      // If something fails, delete the corpus draft and abort.
      await deleteResource("corpus", id);
      throw error;
    }
  }

  // Like the `saveConfigOptions` in `corpus.composable.ts` but takes `id` as argument.
  async function saveConfigOptions(configOptions: ConfigOptions, id: string) {
    const configYaml = makeConfig(id, configOptions);
    await uploadConfig("corpus", id, configYaml);
  }

  async function createCorpus(
    name: string,
    description: string,
    format: CorpusSourceFormat,
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
      await deleteResource("corpus", id);
      // Rethrow error
      throw e;
    }

    // Show the created corpus.
    router.push(`/library/corpus/${id}`);
  }

  return {
    createCorpusFromUpload,
    createCorpus,
  };
}
