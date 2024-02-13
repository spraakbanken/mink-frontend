import useResources from "@/library/resources.composable";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(resourceId: string) {
  const { loadResources } = useResources();

  /**
   * Load data about a metadata and store it.
   */
  async function loadMetadata(): Promise<void> {
    // Make sure the resource has an entry in the store.
    await loadResources();

    // Skip if already loaded.
    if (isFresh[resourceId]) {
      return;
    }

    // Remember to skip loading next time.
    isFresh[resourceId] = true;
  }

  return { loadMetadata };
}
