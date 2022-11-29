import useConfig from "./config";
import useExports from "./exports";
import useJob from "./job";
import useSources from "./sources";

export default function useCorpus(corpusId) {
  const { loadConfig } = useConfig(corpusId);
  const { loadExports } = useExports(corpusId);
  const { loadJob } = useJob(corpusId);
  const { loadSources } = useSources(corpusId);

  async function loadCorpus() {
    return Promise.all([
      loadConfig(), //
      loadExports(),
      loadJob(),
      loadSources(),
    ]);
  }

  return { loadCorpus };
}
