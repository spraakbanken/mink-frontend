<script setup lang="ts">
import { computed, ref } from "vue";
import { formatDate } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useJob from "./job.composable";
import JobStatusMessage from "./JobStatusMessage.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const corpusId = useCorpusIdParam();
const { runJob, abortJob, jobStatus, jobState, isJobRunning } =
  useJob(corpusId);
const { canBeReady, isFailed } = useCorpusState(corpusId);

const isPending = ref(false);
const canRun = computed(
  () => canBeReady.value && !isPending.value && !isJobRunning.value,
);
const hasStarted = computed(
  () =>
    Object.values(jobStatus.value?.status || {}).some(
      (status) => status != "none",
    ) || jobStatus.value?.priority,
);

async function doRunJob() {
  isPending.value = true;
  await runJob();
  isPending.value = false;
}
</script>

<template>
  <PendingContent v-if="jobStatus" :on="`corpus/${corpusId}/job`">
    <div class="flex gap-4 justify-between items-baseline">
      <div class="text-lg">
        <span v-if="jobStatus.current_process">
          {{ $t(`job.process.${jobStatus.current_process}`) }}:
        </span>
        <JobStatusMessage :corpus-id="corpusId" class="font-bold" />
      </div>

      <div class="text-sm text-right">
        <ActionButton
          v-if="!isJobRunning"
          :disabled="!canRun"
          :class="{
            'button-primary':
              jobState?.sparv == 'none' || jobState?.sparv == 'aborted',
          }"
          @click="canRun ? doRunJob() : null"
        >
          <icon :icon="['fas', 'gears']" class="mr-1" />
          {{ jobState?.sparv != "done" ? $t("job.run") : $t("job.rerun") }}
        </ActionButton>

        <ActionButton v-else class="button-danger ml-2" @click="abortJob">
          {{ $t("job.abort") }}
        </ActionButton>

        <div v-if="!isJobRunning && jobState?.sparv == 'done'">
          <icon icon="circle-info" /> {{ $t("job.rerun.overwrite") }}
        </div>
      </div>
    </div>

    <ProgressBar
      v-if="jobStatus?.progress"
      :percent="parseInt(jobStatus.progress)"
      class="w-full my-2"
    />

    <table v-if="hasStarted" class="w-full mt-4">
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
