import { computed, watch } from "vue";
import { useInterval } from "@vueuse/shared";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";
import type { JobType } from "@/api/api.types";
import { useMatomo } from "@/matomo";

// Module-scope ticker, can be watched to perform task intermittently
const pollTick = useInterval(2000);

// Corpus ids are added as keys to this object to indicate that a status request is active.
const pollTracker: Record<string, boolean> = {};

export default function useJob(corpusId: string) {
  const resourceStore = useResourceStore();
  const corpus = computed(() => resourceStore.corpora[corpusId]);
  const mink = useMinkBackend();
  const { alertError } = useMessenger();
  const matomo = useMatomo();

  async function loadJob() {
    resourceStore.invalidateResource(corpusId);
    resourceStore.loadResource(corpusId);
  }

  async function runJob() {
    matomo?.trackEvent("Corpus", "Annotation", "Start");
    const info = await mink.runJob(corpusId).catch(alertError);
    corpus.value.status = info.job;
  }

  async function installKorp() {
    matomo?.trackEvent("Corpus", "Tool install", "Korp");
    const info = await mink.installKorp(corpusId).catch(alertError);
    if (!info) return;
    corpus.value.status = info.job;
  }

  async function installStrix() {
    matomo?.trackEvent("Corpus", "Tool install", "Strix");
    const info = await mink.installStrix(corpusId).catch(alertError);
    if (!info) return;
    corpus.value.status = info.job;
  }

  async function abortJob() {
    matomo?.trackEvent("Corpus", "Annotation", "Abort");
    await mink.abortJob(corpusId).catch(alertError);
    await loadJob();
  }

  async function clearAnnotations() {
    matomo?.trackEvent("Corpus", "Annotation", "Clear");
    await mink.clearAnnotations(corpusId).catch(alertError);
  }

  const jobStatus = computed(() => corpus.value?.status);
  const jobState = computed(() => corpus.value?.status?.status);
  const currentStatus = computed(() => {
    const process = jobStatus.value?.current_process;
    return process && jobStatus.value?.status?.[process];
  });
  const hasError = computed(() =>
    Object.values(jobState.value || {}).includes("error"),
  );

  // "Running" if any job is waiting/running.
  const isJobRunning = computed(() => {
    const statuses = jobState.value;
    if (!statuses) return false;
    return (Object.keys(statuses) as JobType[]).some((process) =>
      ["waiting", "running"].includes(statuses[process]),
    );
  });

  // "Done" if Sparv is done, and Korp is not running/error.
  const isJobDone = computed(
    () =>
      jobState.value?.sparv == "done" &&
      ["none", "aborted", "done"].includes(jobState.value.korp),
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
    clearAnnotations,
    jobStatus,
    jobState,
    currentStatus,
    isJobRunning,
    isJobDone,
    hasError,
  };
}
