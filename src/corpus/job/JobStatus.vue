<script setup lang="ts">
import { computed } from "vue";
import useJob from "@/corpus/job/job.composable";
import JobStatusMessage from "@/corpus/job/JobStatusMessage.vue";
import { formatDate } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const corpusId = useCorpusIdParam();
const { abortJob, jobStatus, isJobRunning } = useJob(corpusId);
const { isFailed } = useCorpusState(corpusId);

const hasStarted = computed(
  () =>
    Object.values(jobStatus.value?.status || {}).some(
      (status) => status != "none",
    ) || jobStatus.value?.priority,
);

const spinTokens = [
  `corpus/${corpusId}/job`,
  `corpus/${corpusId}/info`,
  `corpus/${corpusId}/install/korp`,
  `corpus/${corpusId}/install/strix`,
];
</script>

<template>
  <PendingContent v-if="jobStatus" :on="spinTokens">
    <div class="flex gap-4 justify-between items-baseline">
      <div class="text-lg">
        <span v-if="jobStatus.current_process">
          {{ $t(`job.process.${jobStatus.current_process}`) }}:
        </span>
        <JobStatusMessage :corpus-id="corpusId" class="font-bold" />
      </div>

      <ActionButton
        v-if="isJobRunning"
        class="button-danger ml-2"
        @click="abortJob"
      >
        {{ $t("job.abort") }}
      </ActionButton>
    </div>

    <ProgressBar
      v-if="jobStatus?.progress"
      :percent="parseInt(jobStatus.progress)"
      class="w-full my-2"
    />

    <table v-if="hasStarted" class="w-full">
      <thead></thead>
      <tbody>
        <tr v-if="jobStatus.errors">
          <th colspan="2">{{ $t("errors") }}</th>
        </tr>
        <tr v-if="jobStatus.errors">
          <td colspan="2">
            <TerminalOutput class="mb-2 h-fit max-h-20 resize-y">
              {{ jobStatus.errors }}
            </TerminalOutput>
          </td>
        </tr>

        <tr v-if="jobStatus.warnings">
          <th colspan="2">{{ $t("warnings") }}</th>
        </tr>
        <tr v-if="jobStatus.warnings">
          <td colspan="2">
            <TerminalOutput class="mb-2 h-fit max-h-20 resize-y">
              {{ jobStatus.warnings }}
            </TerminalOutput>
          </td>
        </tr>

        <tr v-if="isFailed && jobStatus.sparv_output">
          <th colspan="2">{{ $t("sparvOutput") }}</th>
        </tr>
        <tr v-if="isFailed && jobStatus.sparv_output">
          <td colspan="2">
            <TerminalOutput class="mb-2 h-fit max-h-20 resize-y">
              {{ jobStatus.sparv_output }}
            </TerminalOutput>
          </td>
        </tr>

        <tr v-if="Number(jobStatus.priority) > 0">
          <th>{{ $t("job.priority") }}</th>
          <td>{{ jobStatus.priority }}</td>
        </tr>

        <tr v-if="jobStatus.last_run_started">
          <th>{{ $t("job.last_run_started") }}</th>
          <td>{{ formatDate(jobStatus.last_run_started) }}</td>
        </tr>

        <tr v-if="jobStatus.last_run_ended">
          <th>{{ $t("job.last_run_ended") }}</th>
          <td>{{ formatDate(jobStatus.last_run_ended) }}</td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>

<style scoped>
/* Override max-height when user is resizing. */
.resize-y[style*="height"] {
  max-height: unset;
}
</style>
