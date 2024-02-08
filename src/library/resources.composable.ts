import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";

/** Let resource list be refreshed initially, but skip subsequent load calls. */
let isFresh = false;

/** Use this module-scope variable for the request, so that simultaneous calls don't procude multiple requests. */
let loadPromise: Promise<unknown> | null = null;

export default function useResources() {
  const resourceStore = useResourceStore();
  const { alertError } = useMessenger();
  const mink = useMinkBackend();

  async function loadResources(force = false) {
    // Skip if already loaded.
    if (isFresh && !force) return;

    // Store the pending request in module scope, so simultaneous calls will await the same promise.
    if (!loadPromise)
      // loadResourceIds has less information, but it is faster and will update UI sooner.
      loadPromise = Promise.all([loadResourceIds(), loadResourceInfo()]);
    await loadPromise;

    // Unset the promise slot to allow any future, forced calls.
    loadPromise = null;
    // Register that data has been loaded to skip future, unforced calls.
    isFresh = true;
  }

  /** Load resource ids and update store to match. */
  async function loadResourceIds() {
    const resourceIds = await mink.loadCorpusIds().catch(alertError);
    if (!resourceIds) return;
    resourceStore.setResourceIds(resourceIds);
  }

  /** Load and store data about all the user's resources. */
  async function loadResourceInfo() {
    const data = await mink.resourceInfoAll().catch(alertError);
    if (!data) return;
    resourceStore.setResources(data.resources);
  }

  /** Signal that info needs to be reloaded, and fetch ids. */
  async function refreshResources() {
    isFresh = false;
    await loadResourceIds();
  }

  return {
    loadResources,
    loadResourceIds,
    loadResourceInfo,
    refreshResources,
  };
}
