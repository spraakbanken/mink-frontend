<script lang="ts" setup>
import JobStatus from "@/job/JobStatus.vue";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

defineProps<{
  id: string;
}>();

const { abortJob } = useCorpusStore();
const { alertError } = useMessenger();
</script>

<template>
  <JobStatus :id @abort="() => abortJob(id).catch(alertError)" />
</template>
