import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useResourceStore } from "@/store/resource.store";
import type { ResourceType } from "@/api/api.types";
import type { Resource } from "@/store/resource.types";

export default function useResource<T extends ResourceType = ResourceType>(
  id: string,
) {
  const { loadResource } = useResourceStore();
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

  return {
    resource,
    job,
    isRunning,
    currentStatus,
  };
}
