import { computed, watch } from "vue";
import { useInterval } from "@vueuse/shared";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker = {};

class JobStatus {
  constructor(v) {
    // none = "Process does not exist"
    // waiting = "Waiting to be processed"
    // running = "Process is running"
    // done = "Process has finished"
    // error = "An error occurred in the process"
    // aborted = "Process was aborted by the user"
    this.allowed = ["done", "none", "aborted", "error", "waiting", "running"];
    this.state = undefined;
    this.set(v);
  }

  set(v) {
    if (v && !this.allowed.includes(v)) {
      throw TypeError(`Not a valid status: "${v}"`);
    }
    this.state = v || undefined;
  }

  get isReady() {
    return ["none", "aborted"].includes(this.state);
  }

  get isError() {
    return this.state == "error";
  }

  get isRunning() {
    return ["waiting", "running"].includes(this.state);
  }

  get isDone() {
    return this.state == "done";
  }
}

export default function useJob(corpusId) {
  const corpusStore = useCorpusStore();
  const corpus = computed(() => corpusStore.corpora[corpusId]);
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  async function loadJob() {
    const info = await mink
      .resourceInfo(corpusId)
      .catch(() => ({}))
      .catch(alertError);
    corpus.value.status = info.job;
  }

  async function runJob() {
    const info = await mink.runJob(corpusId).catch(alertError);
    corpus.value.status = info.job;
  }

  async function installKorp() {
    const info = await mink.installKorp(corpusId).catch(alertError);
    corpus.value.status = info.job;
  }

  async function installStrix() {
    const info = await mink.installStrix(corpusId).catch(alertError);
    corpus.value.status = info.job;
  }

  async function abortJob() {
    await mink.abortJob(corpusId).catch(alertError);
    await loadJob();
  }

  const jobStatus = computed(() => corpus.value?.status);
  const sparvStatus = computed(
    () => new JobStatus(jobStatus.value?.status?.sparv)
  );
  const korpStatus = computed(
    () => new JobStatus(jobStatus.value?.status?.korp)
  );
  const strixStatus = computed(
    () => new JobStatus(jobStatus.value?.status?.strix)
  );
  const currentStatus = computed(() => {
    const process = jobStatus.value.current_process;
    return new JobStatus(jobStatus.value?.status?.[process]);
  });

  // "Running" if any job is waiting/running.
  const isJobRunning = computed(() => {
    const statuses = jobStatus.value?.status;
    if (!statuses) return false;
    return Object.keys(statuses).some(
      (process) => new JobStatus(statuses[process]).isRunning
    );
  });

  // "Done" if Sparv is done, and Korp is not running/error.
  const isJobDone = computed(
    () =>
      sparvStatus.value.isDone &&
      (korpStatus.value.isReady || korpStatus.value.isDone)
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
    installKorp,
    installStrix,
    jobStatus,
    sparvStatus,
    korpStatus,
    strixStatus,
    currentStatus,
    isJobRunning,
    isJobDone,
  };
}
