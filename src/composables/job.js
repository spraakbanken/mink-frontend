// import { onUnmounted } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import {
  api,
  isStatusRunning,
  isStatusStarted,
  statusMessage,
  isStatusDone,
} from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { useStore } from "vuex";
import { onUnmounted } from "vue";
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
    const status = await spin(
      api.getJob(corpusIdFixed),
      t("job.loading"),
      token.value
    );
    recordJobStatus(corpusIdFixed, status);
  }

  async function runJob() {
    const corpusIdFixed = corpusId.value;
    const status = await spin(
      api.queueJob(corpusIdFixed),
      t("job.starting"),
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
      loadJobTimer = setTimeout(() => loadJob(corpusId, token.value), 10_000);
  }

  // Whichever component triggered loadJob, if it disappears, stop polling.
  onUnmounted(() => clearTimeout(loadJobTimer));

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
    abortJob,
    jobStatus,
    isJobStarted,
    isJobRunning,
    isJobDone,
    jobStatusMessage,
    exports,
  };
}
