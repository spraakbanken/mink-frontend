<script setup lang="ts">
import JobStatusPanelContent from "./JobStatusPanelContent.vue";
import useResource from "@/resource/resource.composable";

const props = defineProps<{
  id: string;
}>();

const { job, abortJob } = useResource(props.id);
</script>

<template>
  <JobStatusPanelContent v-if="job" :id :job @abort="abortJob(id)" />
</template>
