import { useStore } from "vuex";
import { useJwt } from "./jwt";
import useMinkBackend from "./backend";
import useConfig from "./config";
import useExports from "./exports";
import useJob from "./job";
import useSources from "./sources";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh = {};

export default function useCorpus(corpusId) {
  const store = useStore();
  const { refreshJwt } = useJwt();
  const mink = useMinkBackend();
  const { loadConfig } = useConfig(corpusId);
  const { loadExports } = useExports(corpusId);
  const { loadJob } = useJob(corpusId);
  const { loadSources } = useSources(corpusId);

  async function loadCorpus(force = false) {
    const isLoaded = Object.keys(store.state.corpora[corpusId]).length;
    if (isLoaded && isCorpusFresh[corpusId] && !force) {
      return;
    }
    await Promise.all([
      loadConfig(), //
      loadExports(),
      loadJob(),
      loadSources(),
    ]);
    isCorpusFresh[corpusId] = true;
  }

  async function deleteCorpus(corpusId_ = corpusId) {
    // Delete corpus in the backend.
    await mink.deleteCorpus(corpusId_);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await refreshJwt();
    store.commit("removeCorpus", corpusId_);
  }

  return { loadCorpus, deleteCorpus };
}
