import { useResourceStore } from "@/store/resource.store";
import useResources from "@/library/resources.composable";
import useConfig from "./config/config.composable";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh: Record<string, boolean> = {};

export default function useCorpus(corpusId: string) {
  const resourceStore = useResourceStore();
  const { loadResource } = useResources();
  const { loadConfig } = useConfig(corpusId);

  /** Load data about a corpus and store it. */
  async function loadCorpus(): Promise<void> {
    // Make sure the corpus has an entry in the store.
    await loadResource(corpusId);

    // Skip if already loaded.
    if (isCorpusFresh[corpusId]) return;

    // Load remaining essential info, unless removed.
    if (corpusId in resourceStore.corpora) {
      await loadConfig();
    }

    // Remember to skip loading next time.
    isCorpusFresh[corpusId] = true;
  }

  return { loadCorpus };
}
