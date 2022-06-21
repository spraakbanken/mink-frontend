// import { onUnmounted } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import {
  getJob,
  isStatusRunning,
  isStatusStarted,
  queueJob,
  abortJob as apiAbortJob,
  statusMessage,
  isStatusDone,
} from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { useStore } from "vuex";

export default function useJob(corpusIdArg) {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId: corpusIdParam } = useCorpusIdParam();
  const corpusId = corpusIdArg ? computed(() => corpusIdArg) : corpusIdParam;
  const token = computed(() => `corpus/${corpusId.value}/job`);

  let loadJobTimer = null;

  async function loadJob() {
    const status = await spin(
      getJob(corpusId.value),
      "Kollar analysstatus",
      token.value
    );
    recordJobStatus(status);
  }

  async function runJob() {
    const status = await spin(
      queueJob(corpusId.value),
      "Lägger analys i kö",
      token.value
    );
    recordJobStatus(status);
  }

  async function abortJob() {
    await spin(apiAbortJob(corpusId.value), "Avbryter analys", token.value);
    await loadJob();
  }

  function recordJobStatus(status) {
    store.commit("setStatus", { corpusId: corpusId.value, status });
    // Refresh automatically.
    if (isJobRunning.value)
      loadJobTimer = setTimeout(() => loadJob(token.value), 10_000);
  }

  // TODO This gives a warning: "onUnmounted is called when there is no active component instance to be associated with."
  //      ^ Maybe because of abhorrent useJob usage in template in Home.vue?
  // onUnmounted(() => clearTimeout(loadJobTimer));

  const jobStatus = computed(() => store.state.corpora[corpusId.value]?.status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const isJobDone = computed(() => isStatusDone(jobStatusId.value));
  const jobStatusMessage = computed(() => statusMessage(jobStatusId.value));
  const exports = computed(() => store.state.corpora[corpusId.value]?.exports);

  return {
    loadJob,
    runJob,
    jobStatus,
    isJobStarted,
    isJobRunning,
    isJobDone,
    jobStatusMessage,
    exports,
  };
}
