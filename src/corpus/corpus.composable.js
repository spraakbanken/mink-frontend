import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import useCorpora from "@/corpora/corpora.composable";
import useConfig from "./config/config.composable";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh = {};

export default function useCorpus(corpusId) {
  const corpusStore = useCorpusStore();
  const { refreshJwt } = useAuth();
  const mink = useMinkBackend();
  const { loadCorpora } = useCorpora();
  const { alertError } = useMessenger();
  const { loadConfig } = useConfig(corpusId);

  async function loadCorpus(force = false) {
    // Make sure the corpus has an entry in the store.
    await loadCorpora();
    if (isCorpusFresh[corpusId] && !force) {
      return;
    }

    // Load remaining essential info about the corpus.
    // Skip if removed.
    if (corpusId in corpusStore.corpora) {
      await loadConfig();
    }

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  async function deleteCorpus(corpusId_ = corpusId) {
    // Delete corpus in the backend.
    await mink.deleteCorpus(corpusId_).catch(alertError);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await refreshJwt();
    corpusStore.removeCorpus(corpusId_);
  }

  return { loadCorpus, deleteCorpus };
}
