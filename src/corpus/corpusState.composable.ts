import { computed } from "vue";
import { useCorpus } from "./corpus.composable";

/** The "corpus state" is related to the job status, but is more about predicting what action the user needs to take. */
export function useCorpusState(corpusId: string) {
  const { sources, hasMetadata, isConfigValid, jobState } = useCorpus(corpusId);

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.NEEDING_CONFIG;
    if (!hasMetadata.value) return CorpusState.NEEDING_META;

    if (!jobState.value) {
      console.warn(`Missing job state for ${corpusId}`);
      return CorpusState.UNKNOWN;
    }

    if (jobState.value.sparv == "none" || jobState.value.sparv == "aborted")
      return CorpusState.READY;
    if (jobState.value.sparv == "error") return CorpusState.FAILED;

    // TODO Revise the CorpusState concept. The workflow can now branch in two. Ifs below questionable.
    if (
      ["waiting", "running"].includes(jobState.value.korp) ||
      ["waiting", "running"].includes(jobState.value.strix)
    )
      return CorpusState.RUNNING_INSTALL;

    if (jobState.value.sparv == "waiting" || jobState.value.sparv == "running")
      return CorpusState.RUNNING;

    if (
      ["none", "aborted"].includes(jobState.value.korp) ||
      ["none", "aborted"].includes(jobState.value.strix)
    )
      return CorpusState.DONE;

    if (jobState.value.korp == "error" || jobState.value.strix == "error")
      return CorpusState.FAILED_INSTALL;

    if (jobState.value.korp == "done" || jobState.value.strix == "done")
      return CorpusState.DONE_INSTALL;

    console.warn("Invalid state", JSON.stringify(jobState.value));
    return CorpusState.UNKNOWN;
  });

  const incompleteStates = [
    CorpusState.EMPTY,
    CorpusState.NEEDING_CONFIG,
    CorpusState.NEEDING_META,
  ];
  const errorStates = [CorpusState.FAILED, CorpusState.FAILED_INSTALL];

  const isIncomplete = computed(() =>
    incompleteStates.includes(corpusState.value),
  );
  const isError = computed(() => errorStates.includes(corpusState.value));
  const isReady = computed(() => corpusState.value == CorpusState.READY);

  return {
    corpusState,
    isIncomplete,
    isError,
    isReady,
  };
}

export class CorpusState {
  static get UNKNOWN() {
    return "unknown";
  }
  static get EMPTY() {
    return "empty";
  }
  static get NEEDING_CONFIG() {
    return "needing_config";
  }
  static get NEEDING_META() {
    return "needing_meta";
  }
  static get FAILED() {
    return "failed";
  }
  static get READY() {
    return "ready";
  }
  static get RUNNING() {
    return "running";
  }
  static get DONE() {
    return "done";
  }
  static get FAILED_INSTALL() {
    return "failed_install";
  }
  static get RUNNING_INSTALL() {
    return "running_install";
  }
  static get DONE_INSTALL() {
    return "done_install";
  }
}
