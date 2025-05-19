import useConfig from "./config/config.composable";
import useSources from "./sources/sources.composable";
import useJob from "./job/job.composable";
import useExports from "./exports/exports.composable";

export function useCorpus(corpusId: string) {
  const config = useConfig(corpusId);
  const sources = useSources(corpusId);
  const job = useJob(corpusId);
  const exports = useExports(corpusId);

  return {
    ...sources,
    ...config,
    ...job,
    ...exports,
  };
}
