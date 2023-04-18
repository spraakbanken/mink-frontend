import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { FORMATS_EXT } from "@/api/corpusConfig";
import useConfig from "./config/config.composable";
import useJob from "./job/job.composable";
import useSources from "./sources/sources.composable";

/** The "corpus state" is related to the job status, but is more about predicting what action the user needs to take. */
export function useCorpusState(corpusId) {
  const { sources } = useSources(corpusId);
  const { config } = useConfig(corpusId);
  const {
    isJobStarted,
    isJobRunning,
    isJobError,
    isJobDone,
    isInstalled,
    isAnnotated,
  } = useJob(corpusId);
  const { t } = useI18n();

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.NEEDING_CONFIG;
    if (!hasMetadata.value) return CorpusState.NEEDING_META;
    if (!isAnnotated.value) {
      if (!isJobStarted.value) return CorpusState.READY;
      if (isJobRunning.value) return CorpusState.RUNNING;
      if (isJobError.value) return CorpusState.FAILED;
    }
    if (!isInstalled.value) {
      if (isJobDone.value) return CorpusState.DONE;
      if (isJobError.value) return CorpusState.FAILED_INSTALL;
    }
    if (isJobRunning.value) return CorpusState.RUNNING_INSTALL;
    if (isJobDone.value) return CorpusState.DONE_INSTALL;
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
  const isFailed = computed(() => corpusState.value == CorpusState.FAILED);
  const isReady = computed(() => corpusState.value == CorpusState.READY);
  const isRunning = computed(() => corpusState.value == CorpusState.RUNNING);
  const isDone = computed(() => corpusState.value == CorpusState.DONE);
  const isFailedInstall = computed(
    () => corpusState.value == CorpusState.FAILED_INSTALL
  );
  const isRunningInstall = computed(
    () => corpusState.value == CorpusState.RUNNING_INSTALL
  );
  const isDoneInstall = computed(
    () => corpusState.value == CorpusState.DONE_INSTALL
  );

  const stateMessage = computed(() => t(`corpus.state.${corpusState.value}`));
  const stateHelp = computed(() => t(`corpus.state.help.${corpusState.value}`));

  return {
    corpusState,
    isEmpty,
    isNeedingConfig,
    isNeedingMeta,
    isFailed,
    isReady,
    isRunning,
    isDone,
    isFailedInstall,
    isRunningInstall,
    isDoneInstall,
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
