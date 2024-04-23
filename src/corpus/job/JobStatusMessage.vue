<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import useJob from "@/corpus/job/job.composable";

const props = defineProps<{
  corpusId: string;
}>();

const { t } = useI18n();
const { currentStatus } = useJob(props.corpusId);

const status = computed(() => currentStatus.value);
const message = computed(() => t(`job.status.${status.value || "none"}`));
</script>

<template>
  <span
    v-if="message"
    :class="{
      'text-gray-400': !status || status == 'none' || status == 'aborted',
      'text-red-500': status == 'error',
      'text-yellow-500': status == 'waiting' || status == 'running',
      'text-lime-600': status == 'done',
    }"
  >
    {{ message }}
  </span>
</template>
