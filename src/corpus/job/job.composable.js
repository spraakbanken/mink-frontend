import { computed, onUnmounted } from "vue";
import {
  isStatusRunning,
  isStatusStarted,
  isStatusDone,
  isStatusError,
  isStatusInstalled,
} from "@/api/api";
import { useI18n } from "vue-i18n";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

export default function useJob(corpusId) {
  const corpusStore = useCorpusStore();
  const corpus = corpusStore.corpora[corpusId];
  const { t } = useI18n();
  const mink = useMinkBackend();

  let loadJobTimer = null;

  async function loadJob() {
    const status = await mink.loadJob(corpusId).catch(() => ({}));
    recordJobStatus(status);
  }

  async function runJob() {
    const status = await mink.runJob(corpusId);
    recordJobStatus(status);
  }

  async function install() {
    const status = await mink.install(corpusId);
    recordJobStatus(status);
  }

  async function abortJob() {
    await mink.abortJob(corpusId);
    await loadJob();
  }

  function recordJobStatus(status) {
    corpus.status = status;
    // Refresh automatically.
    if (isJobRunning.value) loadJobTimer = setTimeout(() => loadJob(), 2000);
  }

  // Whichever component triggered loadJob, if it disappears, stop polling.
  onUnmounted(() => clearTimeout(loadJobTimer));

  const jobStatus = computed(() => corpus?.status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const isJobDone = computed(() => isStatusDone(jobStatusId.value));
  const isInstalled = computed(() => isStatusInstalled(jobStatusId.value));
  const isJobError = computed(() => isStatusError(jobStatusId.value));
  const jobStatusMessage = computed(
    () => jobStatusId.value && t(`job.status.${jobStatusId.value}`)
  );

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
  };
}
