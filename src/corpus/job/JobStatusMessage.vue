<template>
  <span
    v-if="jobStatusMessage"
    :class="{
      'text-gray-400': status.isReady,
      'text-red-500': status.isError,
      'text-yellow-500': status.isRunning,
      'text-lime-600': status.isDone,
    }"
  >
    {{ message }}
  </span>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import useJob from "./job.composable";
import { computed } from "vue";

const props = defineProps({
  corpusId: {
    type: String,
    required: true,
    validate: (x) => x,
  },
});

const { t } = useI18n();
const { sparvStatus, korpStatus, jobStatusMessage } = useJob(props.corpusId);

const status = computed(() =>
  !sparvStatus.value.isDone ? sparvStatus.value : korpStatus.value
);
const message = computed(() => t(`job.status.${status.value.state}`));
</script>
