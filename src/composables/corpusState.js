import { computed } from "vue";
import { useI18n } from "vue-i18n";
import useConfig from "./config";
import useJob from "./job";
import useSources from "./sources";

export function useCorpusState(corpusIdArg) {
  const { sources } = useSources(corpusIdArg);
  const { isConfigValid } = useConfig(corpusIdArg);
  const { isJobStarted, isJobRunning, isJobError, isJobDone } =
    useJob(corpusIdArg);
  const { t } = useI18n();

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.UNCONFIGURED;
    if (!isJobStarted.value) return CorpusState.READY;
    if (isJobRunning.value) return CorpusState.RUNNING;
    if (isJobError.value) return CorpusState.FAILED;
    if (isJobDone.value) return CorpusState.DONE;
    return undefined;
  });

  const isEmpty = computed(() => corpusState.value == CorpusState.EMPTY);
  const isUnconfigured = computed(
    () => corpusState.value == CorpusState.UNCONFIGURED
  );
  const isReady = computed(() => corpusState.value == CorpusState.READY);
  const isRunning = computed(() => corpusState.value == CorpusState.RUNNING);
  const isFailed = computed(() => corpusState.value == CorpusState.FAILED);
  const isDone = computed(() => corpusState.value == CorpusState.DONE);

  const stateMessage = computed(() => t(`corpus.state.${corpusState.value}`));
  const stateHelp = computed(() => t(`corpus.state.help.${corpusState.value}`));

  return {
    corpusState,
    isEmpty,
    isUnconfigured,
    isReady,
    isRunning,
    isFailed,
    isDone,
    stateMessage,
    stateHelp,
  };
}

export class CorpusState {
  static get EMPTY() {
    return "empty";
  }
  static get UNCONFIGURED() {
    return "unconfigured";
  }
  static get READY() {
    return "ready";
  }
  static get RUNNING() {
    return "running";
  }
  static get FAILED() {
    return "failed";
  }
  static get DONE() {
    return "done";
  }
}
