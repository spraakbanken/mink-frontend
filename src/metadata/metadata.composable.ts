import useResources from "@/library/resources.composable";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(resourceId: string) {
  const { loadResources } = useResources();

  /**
   * Load data about a metadata and store it.
   *
   * @param force Calling again will do nothing, unless `force` is enabled
   */
  async function loadMetadata(force = false): Promise<void> {
    if (!resourceId) {
      throw new RangeError("Corpus ID missing");
    }

    // Make sure the corpus has an entry in the store.
    await loadResources();
    if (isFresh[resourceId] && !force) {
      return;
    }

    // Remember to skip loading next time.
    isFresh[resourceId] = true;
  }

  return { loadMetadata };
}
