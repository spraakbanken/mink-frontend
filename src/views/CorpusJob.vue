<template>
  <PendingContent :on="`corpus/${corpusId}/job`">
    <Section :title="$t('analysis')">
      <table class="w-full my-4">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("job.status") }}</th>
            <td>
              <div>{{ jobStatusMessage }}</div>
              <ProgressBar
                v-if="jobStatus.progress"
                :percent="parseInt(jobStatus.progress)"
              />
            </td>
          </tr>
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

      <div class="flex justify-center">
        <ActionButton
          v-if="hasConfig && !isJobRunning"
          variant="primary"
          class="mr-2"
          @click="runJob"
        >
          <icon :icon="['fas', 'gears']" class="mr-1" />
          {{ $t("job_run") }}
        </ActionButton>

        <ActionButton v-if="isJobRunning" variant="danger" @click="abortJob">
          {{ $t("job_abort") }}
        </ActionButton>
      </div>
    </Section>
  </PendingContent>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useJob from "@/composables/job";
import useCorpusIdParam from "@/composables/corpusIdParam";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import PendingContent from "@/components/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import { formatDate, formatSeconds } from "@/util";
import ProgressBar from "@/components/ProgressBar.vue";

const store = useStore();
const {
  loadJob,
  runJob,
  abortJob,
  jobStatus,
  isJobRunning,
  isJobError,
  jobStatusMessage,
} = useJob();
const { corpusId } = useCorpusIdParam();
const hasConfig = computed(() => store.state.corpora[corpusId.value].config);

loadJob();
</script>

<style></style>
