<script lang="ts" setup>
/** Displays current job status of a resource */
import useResource from "@/resource/resource.composable";

const props = defineProps<{
  id: string;
}>();

const { currentStatus } = useResource(props.id);
</script>

<template>
  <span
    v-if="currentStatus"
    class="rounded-sm py-0.5"
    :class="{
      'text-white px-2': ['running', 'done', 'error'].includes(currentStatus),
      'bg-lime-700': currentStatus == 'done',
      'bg-yellow-700': currentStatus == 'running',
      'bg-red-600': currentStatus == 'error',
    }"
  >
    {{ $t(`job.status.${currentStatus}`) }}
  </span>
</template>
