import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useMatomo } from "vue3-matomo";
import { useResourceStore } from "@/store/resource.store";
import type { ResourceType } from "@/api/api.types";
import type { Resource } from "@/store/resource.types";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export default function useResource<T extends ResourceType = ResourceType>(
  id: string,
) {
  const { loadResource } = useResourceStore();
  const matomo = useMatomo();
  const { spin } = useSpin();

  const resource = computedAsync(
    () => loadResource(id) as Promise<Resource<T>>,
  );

  const job = computed(() => resource.value?.job);

  const isRunning = computed(() =>
    ["waiting", "running"].includes(currentStatus.value || ""),
  );

  const currentStatus = computed(() => {
    const process = job.value?.current_process;
    return process && job.value?.status?.[process];
  });

  async function runJob() {
    const resource = await loadResource(id);
    matomo.value?.trackEvent("Job", "Start", resource.type);
    const info = await spin(api.runJob(resource.type, id), `${id}/job/run`);
    resource.job = info.job;
  }

  async function abortJob(id: string) {
    const resource = await loadResource(id);
    matomo.value?.trackEvent("Job", "Abort", resource.type);
    await spin(api.abortJob(resource.type, id), `${id}/job/abort`);
    // Get updated job info
    await loadResource(id, true);
  }

  return {
    resource,
    job,
    isRunning,
    currentStatus,
    runJob,
    abortJob,
  };
}
