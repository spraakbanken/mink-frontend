import { useResourceStore } from "@/store/resource.store";
import useResources from "@/library/resources.composable";
import useConfig from "./config/config.composable";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh: Record<string, boolean> = {};

export default function useCorpus(corpusId: string) {
  const resourceStore = useResourceStore();
  const { loadResources } = useResources();
  const { loadConfig } = useConfig(corpusId);

  /**
   * Load data about a corpus and store it.
   */
  async function loadCorpus(): Promise<void> {
    // Make sure the corpus has an entry in the store.
    await loadResources();
    if (isCorpusFresh[corpusId]) {
      return;
    }

    // Load remaining essential info about the corpus.
    // Skip if removed.
    if (corpusId in resourceStore.corpora) {
      await loadConfig();
    }

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  return { loadCorpus };
}
