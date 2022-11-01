import { onUnmounted } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import {
  api,
  isStatusRunning,
  isStatusStarted,
  isStatusDone,
  isStatusError,
  isStatusInstalled,
} from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default function useJob(corpusIdArg) {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();
  const { corpusId: corpusIdParam } = useCorpusIdParam();
  const corpusId = corpusIdArg ? computed(() => corpusIdArg) : corpusIdParam;
  const token = computed(() => `corpus/${corpusId.value}/job`);

  let loadJobTimer = null;

  async function loadJob(corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId.value;
    return spin(api.checkStatus(corpusIdFixed), t("job.loading"), token.value)
      .then((status) => recordJobStatus(corpusIdFixed, status))
      .catch(() => recordJobStatus(corpusIdFixed, {}));
  }

  async function runJob() {
    const corpusIdFixed = corpusId.value;
    const status = await spin(
      api.runSparv(corpusIdFixed),
      t("job.starting"),
      token.value
    );
    recordJobStatus(corpusIdFixed, status);
  }

  async function install() {
    const corpusIdFixed = corpusId.value;
    const status = await spin(
      api.installCorpus(corpusIdFixed),
      t("job.installing"),
      token.value
    );
    recordJobStatus(corpusIdFixed, status);
  }

  async function abortJob() {
    await spin(api.abortJob(corpusId.value), t("job.aborting"), token.value);
    await loadJob();
  }

  function recordJobStatus(corpusId, status) {
    store.commit("setStatus", { corpusId, status });
    // Refresh automatically.
    if (isJobRunning.value)
      loadJobTimer = setTimeout(() => loadJob(corpusId, token.value), 2000);
  }

  // Whichever component triggered loadJob, if it disappears, stop polling.
  onUnmounted(() => clearTimeout(loadJobTimer));

  const jobStatus = computed(() => store.state.corpora[corpusId.value]?.status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const isJobDone = computed(() => isStatusDone(jobStatusId.value));
  const isInstalled = computed(() => isStatusInstalled(jobStatusId.value));
  const isJobError = computed(() => isStatusError(jobStatusId.value));
  const jobStatusMessage = computed(
    () => jobStatusId.value && t(`job.status.${jobStatusId.value}`)
  );
  const exports = computed(() => store.state.corpora[corpusId.value]?.exports);

  return {
    loadJob,
    runJob,
    abortJob,
    jobStatus,
    isJobStarted,
    isJobRunning,
    isJobDone,
    isInstalled,
    isJobError,
    jobStatusMessage,
    exports,
  };
}
