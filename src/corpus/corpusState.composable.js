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
  const { sparvStatus, korpStatus } = useJob(corpusId);
  const { t } = useI18n();

  const corpusState = computed(() => {
    if (!sources.value.length) return CorpusState.EMPTY;
    if (!isConfigValid.value) return CorpusState.NEEDING_CONFIG;
    if (!hasMetadata.value) return CorpusState.NEEDING_META;

    if (sparvStatus.value.isReady) return CorpusState.READY;
    if (sparvStatus.value.isError) return CorpusState.FAILED;
    if (korpStatus.value.isRunning) return CorpusState.RUNNING_INSTALL;
    if (sparvStatus.value.isRunning) return CorpusState.RUNNING;
    if (korpStatus.value.isReady) return CorpusState.DONE;
    if (korpStatus.value.isError) return CorpusState.FAILED_INSTALL;
    if (korpStatus.value.isDone) return CorpusState.DONE_INSTALL;

    throw RangeError(
      `Invalid state, sparv=${sparvStatus.value}, korp=${korpStatus.value}`
    );
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
const canBeReady = computed(() => !isEmpty.value && !isNeedingConfig.value && !isNeedingMeta.value)

  const isFailed = computed(
    () =>
      corpusState.value == CorpusState.FAILED ||
      corpusState.value == CorpusState.FAILED_INSTALL
  );
  const isReady = computed(() => corpusState.value == CorpusState.READY);
  const isRunning = computed(() => corpusState.value == CorpusState.RUNNING);
  const isDone = computed(() => corpusState.value == CorpusState.DONE);
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
    canBeReady,
    isFailed,
    isReady,
    isRunning,
    isDone,
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
