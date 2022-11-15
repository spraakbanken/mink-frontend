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
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default function useJob(corpusId) {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();
  const token = `corpus/${corpusId}/job`;

  let loadJobTimer = null;

  async function loadJob(corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId;
    return spin(api.checkStatus(corpusIdFixed), t("job.loading"), token)
      .then((status) => recordJobStatus(corpusIdFixed, status))
      .catch(() => recordJobStatus(corpusIdFixed, {}));
  }

  async function runJob() {
    const corpusIdFixed = corpusId;
    const status = await spin(
      api.runSparv(corpusIdFixed),
      t("job.starting"),
      token
    );
    recordJobStatus(corpusIdFixed, status);
  }

  async function install() {
    const corpusIdFixed = corpusId;
    const status = await spin(
      api.installCorpus(corpusIdFixed),
      t("job.installing"),
      token
    );
    recordJobStatus(corpusIdFixed, status);
  }

  async function abortJob() {
    await spin(api.abortJob(corpusId), t("job.aborting"), token);
    await loadJob();
  }

  function recordJobStatus(corpusId, status) {
    store.commit("setStatus", { corpusId, status });
    // Refresh automatically.
    if (isJobRunning.value)
      loadJobTimer = setTimeout(() => loadJob(corpusId, token), 2000);
  }

  // Whichever component triggered loadJob, if it disappears, stop polling.
  onUnmounted(() => clearTimeout(loadJobTimer));

  const jobStatus = computed(() => store.state.corpora[corpusId]?.status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const isJobDone = computed(() => isStatusDone(jobStatusId.value));
  const isInstalled = computed(() => isStatusInstalled(jobStatusId.value));
  const isJobError = computed(() => isStatusError(jobStatusId.value));
  const jobStatusMessage = computed(
    () => jobStatusId.value && t(`job.status.${jobStatusId.value}`)
  );
  const exports = computed(() => store.state.corpora[corpusId]?.exports);

  return {
    loadJob,
    runJob,
    abortJob,
    install,
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
