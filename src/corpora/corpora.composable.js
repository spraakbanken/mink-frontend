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

  async function doLoadCorpora() {
    const corpusIds = await mink.loadCorpora().catch(alertError);
    corpusStore.setCorpusIds(corpusIds);
  }

  async function loadCorpora(force = false) {
    // Skip if already loaded.
    if (isCorporaFresh && !force) return;

    // Store the pending request in module scope, so simultaneous calls will await the same promise.
    if (!loadPromise) loadPromise = doLoadCorpora();
    await loadPromise;

    // Unset the promise slot to allow any future, forced calls.
    loadPromise = null;
    // Register that data has been loaded to skip future, unforced calls.
    isCorporaFresh = true;
  }

  return {
    loadCorpora,
  };
}
