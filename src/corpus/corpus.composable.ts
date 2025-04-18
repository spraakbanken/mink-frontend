import { useResourceStore } from "@/store/resource.store";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh: Record<string, boolean> = {};

export default function useCorpus(corpusId: string) {
  const resourceStore = useResourceStore();

  /** Load data about a corpus and store it. */
  async function loadCorpus(): Promise<void> {
    // Make sure the corpus has an entry in the store.
    await resourceStore.loadResource(corpusId);

    // Skip if already loaded.
    if (isCorpusFresh[corpusId]) return;

    // Load remaining essential info, unless removed.
    if (corpusId in resourceStore.corpora) {
      await resourceStore.loadConfig(corpusId);
    }

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  return { loadCorpus };
}
