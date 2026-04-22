import { useRouter } from "vue-router";
import { emptyConfig, makeConfig } from "./config/lexiconConfig";
import api from "@/api/api";
import { useAuth } from "@/auth/auth.composable";
import useDeleteResource from "@/resource/deleteResource.composable";

export default function useCreateLexicon() {
  const { refreshAuth } = useAuth();
  const { deleteResource } = useDeleteResource();
  const router = useRouter();

  async function createLexicon(name: string) {
    const id = await api.createLexicon();
    // Have the new lexicon included in further API calls.
    await refreshAuth();

    const configOptions = {
      ...emptyConfig(),
      name: { swe: name, eng: name },
    };

    const config = makeConfig(id, configOptions);
    await api.uploadConfig("lexicon", id, config);

    // Show the created resource.
    router.push(`/library/lexicon/${id}`);
  }

  async function createLexiconFromUpload(files: File[]) {
    // Create empty lexicon
    const id = await api.createLexicon();
    // Have the new lexicon included in further API calls.
    await refreshAuth();

    // Create default config
    const config = makeConfig(id, emptyConfig());

    // Wait for sources and config to be uploaded in parallel.
    try {
      await Promise.all([
        api.uploadSources("lexicon", id, files),
        api.uploadConfig("lexicon", id, config),
      ]);
      // Visit new lexicon when successfully created.
      router.push(`/library/lexicon/${id}`);
    } catch (error) {
      // If something fails, delete the lexicon draft and abort.
      await deleteResource("lexicon", id);
      throw error;
    }
  }

  return {
    createLexicon,
    createLexiconFromUpload,
  };
}
