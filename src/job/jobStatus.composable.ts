import { computed, toValue, type MaybeRefOrGetter } from "vue";
import type { JobInfo, ResourceType } from "@/api/api.types";

export function useJobStatus<T extends ResourceType>(
  job: MaybeRefOrGetter<JobInfo<T> | undefined>,
) {
  const isRunning = computed(() =>
    ["waiting", "running"].includes(currentStatus.value || ""),
  );

  const currentStatus = computed(() => {
    const process = toValue(job)?.current_process || undefined;
    return process && toValue(job)?.status?.[process];
  });

  return { currentStatus, isRunning };
}
