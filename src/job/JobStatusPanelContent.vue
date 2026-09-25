<script setup lang="ts" generic="T extends ResourceType">
import JobStatusMessage from "./JobStatusMessage.vue";
import { useJobStatus } from "./jobStatus.composable.ts";
import useLocale from "@/i18n/locale.composable";
import ActionButton from "@/components/ActionButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import HeightResizable from "@/components/HeightResizable.vue";
import type { JobInfo, ResourceType } from "@/api/api.types.ts";

const props = defineProps<{
  job?: JobInfo<T>;
}>();

defineEmits<{
  (e: "abort"): void;
}>();

const { formatDate } = useLocale();
const { currentStatus, isRunning } = useJobStatus(() => props.job);
</script>

<template>
  <div>
    <div class="flex gap-4 justify-between items-baseline">
      <div class="text-lg">
        <span v-if="job?.current_process">
          {{ $t(`job.process.${job.current_process}`) }}:
        </span>
        <JobStatusMessage :status="currentStatus" />
      </div>

      <ActionButton
        v-if="isRunning"
        class="button-danger ml-2"
        @click="$emit('abort')"
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

    <table v-if="job" class="w-full table-fixed">
      <thead></thead>
      <tbody>
        <tr v-if="job.errors">
          <th colspan="2">{{ $t("errors") }}</th>
        </tr>
        <tr v-if="job.errors">
          <td colspan="2">
            <HeightResizable class="mb-2">
              <TerminalOutput>{{ job.errors }}</TerminalOutput>
            </HeightResizable>
          </td>
        </tr>

        <tr v-if="job.warnings">
          <th colspan="2">{{ $t("warnings") }}</th>
        </tr>
        <tr v-if="job.warnings">
          <td colspan="2">
            <HeightResizable class="mb-2">
              <TerminalOutput>{{ job.warnings }}</TerminalOutput>
            </HeightResizable>
          </td>
        </tr>

        <tr v-if="currentStatus == 'error' && job.output">
          <th colspan="2">{{ $t("job.process_output") }}</th>
        </tr>
        <tr v-if="currentStatus == 'error' && job.output">
          <td colspan="2">
            <HeightResizable class="mb-2">
              <TerminalOutput>{{ job.output }}</TerminalOutput>
            </HeightResizable>
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
