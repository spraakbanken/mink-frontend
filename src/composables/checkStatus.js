import { computed } from "@vue/reactivity";
import { getJob } from "@/assets/api";
import { spin } from "@/assets/spin";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default function useCheckStatus() {
  const store = useStore();
  const route = useRoute();
  const corpusId = route.params.corpusId;

  let loadJobTimer = null;

  function loadJob() {
    spin(getJob(corpusId), "Kollar analysstatus").then((status) => {
      store.commit("setStatus", { corpusId, status });
      // Refresh automatically.
      if (isJobRunning.value) loadJobTimer = setTimeout(loadJob, 10_000);
    });
  }

  const jobStatus = computed(() => store.state.corpora[corpusId].status);
  const isJobStarted = computed(() => jobStatus.value?.job_status != "none");
  const isJobRunning = computed(
    () =>
      !["none", "done", "error", "aborted"].includes(
        jobStatus.value?.job_status
      )
  );
  const jobStatusMessage = computed(
    () => STATUSES[jobStatus.value?.job_status]?.message
  );
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

const STATUSES = {
  none: { state: 0, message: "" },
  syncing_corpus: { state: 1, message: "Syncar korpus" },
  waiting: { state: 1, message: "Väntar" },
  annotating: { state: 1, message: "Annoterar" },
  done_annotating: { state: 1, message: "Annotering färdig" },
  syncing_results: { state: 1, message: "Syncar resultat" },
  done: { state: 2, message: "Färdig" },
  error: { state: 2, message: "Fel" },
  aborted: { state: 2, message: "Avbruten" },
};
