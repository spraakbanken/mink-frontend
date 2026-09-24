<script setup lang="ts">
import { computed } from "vue";
import JobStatusMessage from "./JobStatusMessage.vue";
import JobStatusDetails from "./JobStatusDetails.vue";
import ActionButton from "@/components/ActionButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import useResource from "@/resource/resource.composable";
import useAlert from "@/alert/alert.composable";

const props = defineProps<{
  id: string;
}>();

const { job, currentStatus, isRunning, abortJob } = useResource(props.id);
const { showAlert } = useAlert();

/** Whether this resource has not yet been processed at all */
const isNew = computed(() =>
  Object.values(job.value?.status || {}).every((status) => status == "none"),
);
</script>

<template>
  <div v-if="job">
    <div class="flex gap-4 justify-between items-baseline">
      <div class="text-lg">
        <span v-if="job.current_process">
          {{ $t(`job.process.${job.current_process}`) }}:
        </span>
        <JobStatusMessage :status="currentStatus" />
      </div>

      <ActionButton
        v-if="isRunning"
        class="button-danger ml-2"
        @click="abortJob(id).catch(showAlert)"
      >
        {{ $t("job.abort") }}
      </ActionButton>
    </div>

    <ProgressBar
      v-if="job?.progress"
      :percent="parseInt(job.progress)"
      :running="isRunning"
      class="w-full my-2"
    />

    <JobStatusDetails v-if="!isNew" :job />
  </div>
</template>
