import { useRouter } from "vue-router";
import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import useConfig from "./config/config.composable";
import useSources from "./sources/sources.composable";
import useCorpus from "./corpus.composable";

export default function useCreateCorpus() {
  const corpusStore = useCorpusStore();
  const router = useRouter();
  const { refreshJwt } = useAuth();
  const { deleteCorpus } = useCorpus();
  const { uploadConfig } = useConfig();
  const { uploadSources } = useSources();
  const { alert, alertError } = useMessenger();
  const mink = useMinkBackend();

  async function createCorpus() {
    const corpusId = await mink.createCorpus().catch(alertError);
    // Have the new corpus included in further API calls.
    await refreshJwt();
    // Adding the new id to store may trigger API calls, so do it after updating the JWT.
    corpusStore.corpora[corpusId] = corpusStore.corpora[corpusId] || {};
    return corpusId;
  }

  async function createFromUpload(files) {
    const corpusId = await createCorpus().catch(alertError);
    if (!corpusId) return;

    // Create a minimal config.
    const config = {
      name: { swe: corpusId, eng: corpusId },
    };

    const results = await Promise.allSettled([
      uploadSources(files, corpusId),
      uploadConfig(config, corpusId),
    ]);

    const rejectedResults = results.filter(
      (result) => result.status != "fulfilled"
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

  async function createFromConfig(name, description, format, textAnnotation) {
    const config = {
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
      format,
      textAnnotation,
    };

    // Create an empty corpus. If it fails, abort.
    let corpusId;
    try {
      corpusId = await createCorpus().catch(alertError);
    } catch (e) {
      alertError(e);
      return;
    }

    // Upload the basic config.
    try {
      await uploadConfig(config, corpusId);
      // Show the created corpus.
      router.push(`/corpus/${corpusId}`);
      return corpusId;
    } catch (e) {
      // If creating the config fails, there's a TypeError.
      if (e.name == "TypeError") alert(e.message, "error");
      // Otherwise it's probably a backend error when saving.
      else alertError(e);
      // Discard the empty corpus.
      await deleteCorpus(corpusId).catch(alertError);
    }
  }

  return {
    createFromUpload,
    createFromConfig,
  };
}
