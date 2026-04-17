<script setup lang="ts">
import { computed } from "vue";
import JobStatusMessage from "./JobStatusMessage.vue";
import useLocale from "@/i18n/locale.composable";
import ActionButton from "@/components/ActionButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import TextData from "@/components/TextData.vue";
import useResource from "@/resource/resource.composable";
import useMessenger from "@/message/messenger.composable";

const props = defineProps<{
  id: string;
}>();

const { currentStatus, job, isRunning, abortJob } = useResource(props.id);
const { formatDate } = useLocale();
const { alertError } = useMessenger();

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
        <JobStatusMessage :id />
      </div>

      <ActionButton
        v-if="isRunning"
        class="button-danger ml-2"
        @click="abortJob(id).catch(alertError)"
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

    <table v-if="!isNew" class="w-full table-fixed">
      <thead></thead>
      <tbody>
        <tr v-if="job.errors">
          <th colspan="2">{{ $t("errors") }}</th>
        </tr>
        <tr v-if="job.errors">
          <td colspan="2">
            <TextData :text="job.errors" class="mb-2" />
          </td>
        </tr>

        <tr v-if="job.warnings">
          <th colspan="2">{{ $t("warnings") }}</th>
        </tr>
        <tr v-if="job.warnings">
          <td colspan="2">
            <TextData :text="job.warnings" class="mb-2" />
          </td>
        </tr>

        <tr v-if="currentStatus == 'error' && job.output">
          <th colspan="2">{{ $t("job.process_output") }}</th>
        </tr>
        <tr v-if="currentStatus == 'error' && job.output">
          <td colspan="2">
            <TextData :text="job.output" class="mb-2" />
          </td>
        </tr>

        <tr v-if="Number(job.priority) > 0">
          <th>{{ $t("job.priority") }}</th>
          <td class="text-right">{{ job.priority }}</td>
        </tr>

        <tr v-if="job.started">
          <th>{{ $t("job.started") }}</th>
          <td class="text-right">
            {{ formatDate(job.started) }}
          </td>
        </tr>

        <tr v-if="job.ended">
          <th>{{ $t("job.ended") }}</th>
          <td class="text-right">{{ formatDate(job.ended) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
