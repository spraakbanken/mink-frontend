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
    // Make sure the corpus has an entry in the store.
    await loadCorpora();
    if (isCorpusFresh[corpusId] && !force) {
      return;
    }

    // Load all essential info about the corpus.
    await Promise.all([
      loadConfig(), //
      loadExports(),
      loadResourceInfo(),
    ]);

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  /** Load job status and source files in the same request. */
  async function loadResourceInfo() {
    const info = await mink.resourceInfo(corpusId).catch(alertError);
    corpusStore.corpora[corpusId].name = info.resource.name;
    corpusStore.corpora[corpusId].sources = info.resource.source_files;
    corpusStore.corpora[corpusId].status = info.job;
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
