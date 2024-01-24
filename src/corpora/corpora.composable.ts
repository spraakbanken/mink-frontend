import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

/** Let corpus list be refreshed initially, but skip subsequent load calls. */
let isCorporaFresh = false;

/** Use this module-scope variable for the request, so that simultaneous calls don't procude multiple requests. */
let loadPromise: Promise<unknown> | null = null;

export default function useCorpora() {
  const corpusStore = useCorpusStore();
  const { alertError } = useMessenger();
  const mink = useMinkBackend();

  async function loadCorpora(force = false) {
    // Skip if already loaded.
    if (isCorporaFresh && !force) return;

    // Store the pending request in module scope, so simultaneous calls will await the same promise.
    if (!loadPromise)
      // loadCorpusIds has less information, but it is faster and will update UI sooner.
      loadPromise = Promise.all([loadCorpusIds(), loadResourceInfo()]);
    await loadPromise;

    // Unset the promise slot to allow any future, forced calls.
    loadPromise = null;
    // Register that data has been loaded to skip future, unforced calls.
    isCorporaFresh = true;
  }

  /** Load corpus ids and update store to match. */
  async function loadCorpusIds() {
    const corpusIds = await mink.loadCorpusIds().catch(alertError);
    if (!corpusIds) return;
    corpusStore.setCorpusIds(corpusIds);
  }

  /** Load and store data about all the user's resources. */
  async function loadResourceInfo() {
    const data = await mink.resourceInfoAll().catch(alertError);
    if (!data) return;
    corpusStore.setCorpora(data.resources);
  }

  /** Signal that info needs to be reloaded, and fetch ids. */
  async function refreshCorpora() {
    isCorporaFresh = false;
    await loadCorpusIds();
  }

  return {
    loadCorpora,
    loadCorpusIds,
    loadResourceInfo,
    refreshCorpora,
  };
}
