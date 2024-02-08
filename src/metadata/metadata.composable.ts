import useResources from "@/library/resources.composable";
import { useResourceStore } from "@/store/resource.store";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(resourceId: string) {
  const { loadResources } = useResources();
  const resourceStore = useResourceStore();

  /**
   * Load data about a metadata and store it.
   *
   * @param force Calling again will do nothing, unless `force` is enabled
   */
  async function loadMetadata(force = false): Promise<void> {
    // Always force it if this resource is currently empty.
    if (!resourceStore.resources[resourceId]?.type) force = true;

    // Make sure the resource has an entry in the store.
    await loadResources(force);

    // Skip if already loaded.
    if (isFresh[resourceId] && !force) {
      return;
    }

    // Remember to skip loading next time.
    isFresh[resourceId] = true;
  }

  return { loadMetadata };
}
