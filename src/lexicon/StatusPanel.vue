<script lang="ts" setup>
import JobStatus from "@/job/JobStatus.vue";
import useMessenger from "@/message/messenger.composable";

defineProps<{
  id: string;
}>();

const { alertError } = useMessenger();

async function abortJob(id: string) {
  throw new Error("TODO");
}
</script>

<template>
  <JobStatus :id @abort="() => abortJob(id).catch(alertError)" />
</template>
