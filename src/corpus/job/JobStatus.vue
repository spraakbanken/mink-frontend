<script setup lang="ts">
import { computed } from "vue";
import { useMatomo } from "@/matomo";
import useJob from "@/corpus/job/job.composable";
import JobStatusMessage from "@/corpus/job/JobStatusMessage.vue";
import { formatDate } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import TextData from "@/components/TextData.vue";

const corpusId = useCorpusIdParam();
const { abortJob, jobStatus, isJobRunning } = useJob(corpusId);
const { isFailed } = useCorpusState(corpusId);
const matomo = useMatomo();

const hasStarted = computed(
  () =>
    Object.values(jobStatus.value?.status || {}).some(
      (status) => status != "none",
    ) || jobStatus.value?.priority,
);

async function doAbortJob() {
  matomo?.trackEvent("Corpus", "Abort annotation", corpusId);
  await abortJob();
}
</script>

<template>
  <PendingContent
    v-if="jobStatus"
    :on="[`corpus/${corpusId}/job`, `corpus/${corpusId}/info`]"
  >
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
        @click="doAbortJob"
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
            <TextData :text="jobStatus.errors" class="mb-2" />
          </td>
        </tr>

        <tr v-if="jobStatus.warnings">
          <th colspan="2">{{ $t("warnings") }}</th>
        </tr>
        <tr v-if="jobStatus.warnings">
          <td colspan="2">
            <TextData :text="jobStatus.warnings" class="mb-2" />
          </td>
        </tr>

        <tr v-if="isFailed && jobStatus.sparv_output">
          <th colspan="2">{{ $t("sparvOutput") }}</th>
        </tr>
        <tr v-if="isFailed && jobStatus.sparv_output">
          <td colspan="2">
            <TextData :text="jobStatus.sparv_output" class="mb-2" />
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
