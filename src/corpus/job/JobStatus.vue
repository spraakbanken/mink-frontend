<script setup lang="ts">
import { computed } from "vue";
import { useCorpus } from "../corpus.composable";
import JobStatusMessage from "@/corpus/job/JobStatusMessage.vue";
import { formatDate } from "@/util";
import ActionButton from "@/components/ActionButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import TextData from "@/components/TextData.vue";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps<{
  corpusId: string;
}>();

const { abortJob } = useCorpusStore();
const { job, isJobRunning, hasError } = useCorpus(props.corpusId);

const isStarted = computed(
  () =>
    Object.values(job.value?.status || {}).some((status) => status != "none") ||
    job.value?.priority,
);
</script>

<template>
  <div v-if="job">
    <div class="flex gap-4 justify-between items-baseline">
      <div class="text-lg">
        <span v-if="job.current_process">
          {{ $t(`job.process.${job.current_process}`) }}:
        </span>
        <JobStatusMessage :corpus-id="corpusId" />
      </div>

      <ActionButton
        v-if="isJobRunning"
        class="button-danger ml-2"
        @click="abortJob(corpusId)"
      >
        {{ $t("job.abort") }}
      </ActionButton>
    </div>

    <ProgressBar
      v-if="job?.progress"
      :percent="parseInt(job.progress)"
      :running="isJobRunning"
      class="w-full my-2"
    />

    <table v-if="isStarted" class="w-full table-fixed">
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

        <tr v-if="hasError && job.sparv_output">
          <th colspan="2">{{ $t("sparvOutput") }}</th>
        </tr>
        <tr v-if="hasError && job.sparv_output">
          <td colspan="2">
            <TextData :text="job.sparv_output" class="mb-2" />
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
