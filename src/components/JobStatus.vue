<template>
  <PendingContent :on="`corpus/${corpusId}/job`">
    <div class="flex flex-wrap gap-4 justify-between items-baseline">
      <div class="text-lg font-bold">
        <JobStatusMessage :corpus-id="corpusId" />
      </div>
      <div class="text-sm">
        <ActionButton
          v-if="config && !isJobRunning && sources.length"
          :variant="isReady ? 'primary' : null"
          @click="runJob"
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
      v-if="jobStatus.progress"
      :percent="parseInt(jobStatus.progress)"
      class="w-full my-2"
    />

    <table v-if="jobStatus.last_run_started" class="w-full mt-4">
      <thead></thead>
      <tbody>
        <tr v-if="jobStatus.errors">
          <th>{{ $t("errors") }}</th>
          <td>
            <TerminalOutput>{{ jobStatus.errors }}</TerminalOutput>
          </td>
        </tr>
        <tr v-if="isJobError && jobStatus.sparv_output">
          <th>{{ $t("sparvOutput") }}</th>
          <td>
            <TerminalOutput>{{ jobStatus.sparv_output }}</TerminalOutput>
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
import { formatDate, formatSeconds } from "@/util";
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";
import useJob from "@/composables/job";
import useSources from "@/composables/sources";
import { useCorpusState } from "@/composables/corpusState";
import ActionButton from "./layout/ActionButton.vue";
import JobStatusMessage from "./JobStatusMessage.vue";
import PendingContent from "./PendingContent.vue";
import ProgressBar from "./ProgressBar.vue";
import TerminalOutput from "./TerminalOutput.vue";

const { corpusId } = useCorpusIdParam();
const { config } = useConfig();
const { loadSources, sources } = useSources();
const { loadJob, runJob, abortJob, jobStatus, isJobRunning, isJobError } =
  useJob();
const { isReady } = useCorpusState();

loadSources();
loadJob();
</script>

<style></style>
