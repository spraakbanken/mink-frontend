import useConfig from "./config";
import useExports from "./exports";
import useJob from "./job";
import useSources from "./sources";

/** Let data be refreshed initially, but skip subsequent load calls. */
const isCorpusFresh = {};

export default function useCorpus(corpusId) {
  const { loadConfig } = useConfig(corpusId);
  const { loadExports } = useExports(corpusId);
  const { loadJob } = useJob(corpusId);
  const { loadSources } = useSources(corpusId);

  async function loadCorpus(force = false) {
    if (isCorpusFresh[corpusId] && !force) {
      return;
    }
    await Promise.all([
      loadConfig(), //
      loadExports(),
      loadJob(),
      loadSources(),
    ]);
    isCorpusFresh[corpusId] = true;
  }

  return { loadCorpus };
}
