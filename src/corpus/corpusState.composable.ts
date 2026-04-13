import { computed } from "vue";
import { useCorpus } from "./corpus.composable";
import useSources from "@/resource/sources.composable";

/** The "corpus state" is related to the job status, but is more about predicting what action the user needs to take. */
export function useCorpusState(id: string) {
  const { isConfigValid, jobState, job, currentStatus } = useCorpus(id);
  const { sources } = useSources("corpus", id);

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.NEEDING_CONFIG;

    if (!jobState.value) {
      console.warn(`Missing job state for ${id}`);
      return CorpusState.UNKNOWN;
    }

    const process = job.value?.current_process || "";
    const isTool = ["korp", "strix"].includes(process);

    if (currentStatus.value == "running" || currentStatus.value == "waiting")
      return isTool ? CorpusState.RUNNING_INSTALL : CorpusState.RUNNING;

    // If the last Sparv job was aborted, encourage re-annotation (even if last process was a tool install)
    if (jobState.value.sparv == "none" || jobState.value.sparv == "aborted")
      return CorpusState.READY;

    if (currentStatus.value == "error")
      return isTool ? CorpusState.FAILED_INSTALL : CorpusState.FAILED;

    if (currentStatus.value == "done")
      return isTool ? CorpusState.DONE_INSTALL : CorpusState.DONE;

    console.warn("Invalid state", JSON.stringify(jobState.value));
    return CorpusState.UNKNOWN;
  });

  const incompleteStates = [CorpusState.EMPTY, CorpusState.NEEDING_CONFIG];
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
