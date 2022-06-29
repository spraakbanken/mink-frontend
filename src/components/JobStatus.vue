<template>
  <span
    :class="{
      'text-lime-600': isJobDone,
      'text-yellow-500': isJobRunning,
      'text-red-700': isJobError,
    }"
  >
    {{ jobStatusMessage }}
  </span>
</template>

<script setup>
import useJob from "@/composables/job";

const props = defineProps({
  corpusId: {
    type: String,
    required: true,
    validate: (x) => x,
  },
});

const { loadJob, jobStatusMessage, isJobDone, isJobRunning, isJobError } =
  useJob(props.corpusId);

loadJob();
</script>
