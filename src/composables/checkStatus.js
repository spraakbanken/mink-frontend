import { onUnmounted } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import {
  getJob,
  isStatusRunning,
  isStatusStarted,
  statusMessage,
} from "@/assets/api";
import { spin } from "@/assets/spin";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default function useCheckStatus(corpusId) {
  const store = useStore();
  const route = useRoute();
  corpusId = corpusId || route.params.corpusId;

  let loadJobTimer = null;

  async function loadJob(el = null) {
    const status = await spin(getJob(corpusId), "Kollar analysstatus", el);
    store.commit("setStatus", { corpusId, status });
    // Refresh automatically.
    if (isJobRunning.value)
      loadJobTimer = setTimeout(() => loadJob(el), 10_000);
  }

  onUnmounted(() => clearTimeout(loadJobTimer));

  const jobStatus = computed(() => store.state.corpora[corpusId].status);
  const jobStatusId = computed(() => jobStatus.value?.job_status);
  const isJobStarted = computed(() => isStatusStarted(jobStatusId.value));
  const isJobRunning = computed(() => isStatusRunning(jobStatusId.value));
  const jobStatusMessage = computed(() => statusMessage(jobStatusId.value));
  const exports = computed(() => store.state.corpora[corpusId].exports);

  return {
    loadJob,
    loadJobTimer,
    jobStatus,
    isJobStarted,
    isJobRunning,
    jobStatusMessage,
    exports,
  };
}
