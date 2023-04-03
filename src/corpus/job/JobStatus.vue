<template>
  <PendingContent :on="`corpus/${corpusId}/job`">
    <div class="flex flex-wrap gap-4 justify-between items-baseline">
      <div class="text-lg font-bold">
        <JobStatusMessage :corpus-id="corpusId" />
      </div>
      <div class="text-sm">
        <ActionButton
          v-if="!isJobRunning"
          :variant="isReady ? 'primary' : null"
          :disabled="!canRun"
          @click="canRun ? doRunJob() : null"
        >
          <icon :icon="['fas', 'gears']" class="mr-1" />
          {{ $t("job_run") }}
        </ActionButton>

        <ActionButton
          v-if="isJobRunning"
          variant="danger"
          class="ml-2"
          @click="abortJob"
        >
          {{ $t("job_abort") }}
        </ActionButton>
      </div>
    </div>

    <ProgressBar
      v-if="jobStatus?.progress"
      :percent="parseInt(jobStatus.progress)"
      class="w-full my-2"
    />

    <table v-if="jobStatus?.last_run_started" class="w-full mt-4">
      <thead></thead>
      <tbody>
        <tr v-if="jobStatus.errors">
          <th colspan="2">{{ $t("errors") }}</th>
        </tr>
        <tr v-if="jobStatus.errors">
          <td colspan="2">
            <TerminalOutput class="whitespace-pre-wrap">{{
              jobStatus.errors
            }}</TerminalOutput>
          </td>
        </tr>
        <tr v-if="isJobError && jobStatus.sparv_output">
          <th colspan="2">{{ $t("sparvOutput") }}</th>
        </tr>
        <tr v-if="isJobError && jobStatus.sparv_output">
          <td colspan="2">
            <TerminalOutput class="whitespace-pre-wrap">{{
              jobStatus.sparv_output
            }}</TerminalOutput>
          </td>
        </tr>
        <tr v-if="jobStatus.last_run_started">
          <th>{{ $t("job.last_run_started") }}</th>
          <td>{{ formatDate(jobStatus.last_run_started) }}</td>
        </tr>
        <tr v-if="jobStatus.last_run_ended">
          <th>{{ $t("job.last_run_ended") }}</th>
          <td>{{ formatDate(jobStatus.last_run_ended) }}</td>
        </tr>
        <tr v-if="jobStatus.seconds_taken">
          <th>{{ $t("job.time_taken") }}</th>
          <td>{{ formatSeconds(jobStatus.seconds_taken) }}</td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>

<script setup>
import { computed, ref } from "vue";
import { formatDate, formatSeconds } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useJob from "./job.composable";
import ProgressBar from "./ProgressBar.vue";
import JobStatusMessage from "./JobStatusMessage.vue";

const corpusId = useCorpusIdParam();
const { runJob, abortJob, jobStatus, isJobRunning, isJobError } =
  useJob(corpusId);
const { isReady, isFailed, isDone, isDoneInstall } = useCorpusState(corpusId);

const isPending = ref(false);
const canRun = computed(
  () =>
    !isPending.value &&
    (isReady.value || isFailed.value || isDone.value || isDoneInstall.value)
);

async function doRunJob() {
  isPending.value = true;
  await runJob();
  isPending.value = false;
}
</script>

<style></style>
