<template>
  <span
    v-if="jobStatusMessage"
    :class="{
      'text-gray-400': !isJobStarted,
      'text-lime-600': isJobDone,
      'text-yellow-500': isJobRunning,
      'text-red-500': isJobError,
    }"
  >
    {{ jobStatusMessage }}
  </span>
</template>

<script setup>
import useJob from "./job.composable";

const props = defineProps({
  corpusId: {
    type: String,
    required: true,
    validate: (x) => x,
  },
});

const { jobStatusMessage, isJobStarted, isJobDone, isJobRunning, isJobError } =
  useJob(props.corpusId);
</script>
