import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { FORMATS_EXT } from "@/api/corpusConfig";
import useConfig from "./config/config.composable";
import useJob from "./job/job.composable";
import useSources from "./sources/sources.composable";

export function useCorpusState(corpusId) {
  const { sources } = useSources(corpusId);
  const { config } = useConfig(corpusId);
  const { isJobStarted, isJobRunning, isJobError, isJobDone } =
    useJob(corpusId);
  const { t } = useI18n();

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.NEEDING_CONFIG;
    if (!hasMetadata.value) return CorpusState.NEEDING_META;
    if (!isJobStarted.value) return CorpusState.READY;
    if (isJobRunning.value) return CorpusState.RUNNING;
    if (isJobError.value) return CorpusState.FAILED;
    if (isJobDone.value) return CorpusState.DONE;
    return undefined;
  });

  const isConfigValid = computed(
    () => config.value && FORMATS_EXT.includes(config.value.format)
  );

  const hasMetadata = computed(
    () => config.value?.name?.swe || config.value?.name?.eng
  );

  const isEmpty = computed(() => corpusState.value == CorpusState.EMPTY);
  const isNeedingConfig = computed(
    () => corpusState.value == CorpusState.NEEDING_CONFIG
  );
  const isNeedingMeta = computed(
    () => corpusState.value == CorpusState.NEEDING_META
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
    isNeedingConfig,
    isNeedingMeta,
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
  static get NEEDING_CONFIG() {
    return "needing_config";
  }
  static get NEEDING_META() {
    return "needing_meta";
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
