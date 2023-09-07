import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import useCorpora from "@/corpora/corpora.composable";
import useConfig from "./config/config.composable";
import useExports from "./exports/exports.composable";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh = {};

export default function useCorpus(corpusId) {
  const corpusStore = useCorpusStore();
  const { refreshJwt } = useAuth();
  const mink = useMinkBackend();
  const { loadCorpora } = useCorpora();
  const { alertError } = useMessenger();
  const { loadConfig } = useConfig(corpusId);
  const { loadExports } = useExports(corpusId);

  async function loadCorpus(force = false) {
    await loadCorpora();
    if (isCorpusFresh[corpusId] && !force) {
      return;
    }
    await Promise.all([
      loadConfig(), //
      loadExports(),
    ]);
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
