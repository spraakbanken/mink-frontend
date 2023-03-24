import { computed, ref, watch } from "vue";
import {
  isStatusRunning,
  isStatusStarted,
  isStatusDone,
  isStatusError,
  isStatusInstalled,
  isStatusAnnotated,
} from "@/api/api";
import { useI18n } from "vue-i18n";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

// Module-scope ticker, can be watched to perform task intermittently
let pollTick = ref(false);
setInterval(() => (pollTick.value = !pollTick.value), 2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker = {};

export default function useJob(corpusId) {
  const corpusStore = useCorpusStore();
  const corpus = corpusStore.corpora[corpusId];
  const { t } = useI18n();
  const mink = useMinkBackend();

  async function loadJob() {
    corpus.status = await mink.loadJob(corpusId).catch(() => ({}));
  }

  async function runJob() {
    corpus.status = await mink.runJob(corpusId);
  }

  async function install() {
    corpus.status = await mink.install(corpusId);
  }

  async function abortJob() {
    await mink.abortJob(corpusId);
    await loadJob();
  }

  const jobStatus = computed(() => corpus?.status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const isJobDone = computed(() => isStatusDone(jobStatusId.value));
  const isInstalled = computed(() => isStatusInstalled(jobStatusId.value));
  const isAnnotated = computed(() => isStatusAnnotated(jobStatusId.value));
  const isJobError = computed(() => isStatusError(jobStatusId.value));
  const jobStatusMessage = computed(
    () => jobStatusId.value && t(`job.status.${jobStatusId.value}`)
  );

  // Check status intermittently if active.
  watch(pollTick, async () => {
    // This composable can be active in multiple components with the same corpus id. Only send request once per corpus.
    if (isJobRunning.value && !pollTracker[corpusId]) {
      pollTracker[corpusId] = true;
      await loadJob();
      pollTracker[corpusId] = false;
    }
  });

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
    isAnnotated,
    isJobError,
    jobStatusMessage,
  };
}
