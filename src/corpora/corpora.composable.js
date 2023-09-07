import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

/** Let corpus list be refreshed initially, but skip subsequent load calls. */
let isCorporaFresh = false;

/** Use this module-scope variable for the request, so that simultaneous calls don't procude multiple requests. */
let loadPromise = null;

export default function useCorpora() {
  const corpusStore = useCorpusStore();
  const { alertError } = useMessenger();
  const mink = useMinkBackend();

  async function loadCorpora(force = false) {
    if (isCorporaFresh && !force) return;

    // Store the pending request in module scope, so simultaneous calls will await the same promise.
    if (!loadPromise) {
      const loadCorporaPromise = mink
        .loadCorpora()
        .catch(alertError)
        .then((corpora) => corpusStore.setCorpusIds(corpora));

      const loadJobsPromise = mink
        .loadJobs()
        .catch(alertError)
        .then((jobs) =>
          jobs.forEach((job) => {
            corpusStore.corpora[job.corpus_id].status = job;
            corpusStore.corpora[job.corpus_id].sources = job.available_files;
          })
        );

      loadPromise = Promise.all([loadCorporaPromise, loadJobsPromise]);
    }

    await loadPromise;

    loadPromise = null;
    isCorporaFresh = true;
  }

  return {
    loadCorpora,
  };
}
