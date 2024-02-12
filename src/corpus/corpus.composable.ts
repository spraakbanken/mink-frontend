import { useCorpusStore } from "@/store/corpus.store";
import useCorpora from "@/corpora/corpora.composable";
import useConfig from "./config/config.composable";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh: Record<string, boolean> = {};

export default function useCorpus(corpusId: string) {
  const corpusStore = useCorpusStore();
  const { loadCorpora } = useCorpora();
  const { loadConfig } = useConfig(corpusId);

  /**
   * Load data about a corpus and store it.
   */
  async function loadCorpus(): Promise<void> {
    if (!corpusId) {
      throw new RangeError("Corpus ID missing");
    }

    // Make sure the corpus has an entry in the store.
    await loadCorpora();
    if (isCorpusFresh[corpusId]) {
      return;
    }

    // Load remaining essential info about the corpus.
    // Skip if removed.
    if (corpusId in corpusStore.corpora) {
      await loadConfig();
    }

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  return { loadCorpus };
}
