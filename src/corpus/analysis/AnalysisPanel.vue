<script setup lang="ts">
import { computed, ref, watch } from "vue";
import useCorpusIdParam from "../corpusIdParam.composable";
import { useCorpusState } from "../corpusState.composable";
import useExports from "../exports/exports.composable";
import useJob from "../job/job.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { runJob, jobState, isJobRunning } = useJob(corpusId);
const { canBeReady } = useCorpusState(corpusId);
const { exports, loadExports, downloadResult, getDownloadFilename } =
  useExports(corpusId);
const { isDone } = useCorpusState(corpusId);

const isPending = ref(false);
const canRun = computed(
  () => canBeReady.value && !isPending.value && !isJobRunning.value,
);

loadExports();

async function doRunJob() {
  isPending.value = true;
  await runJob();
  isPending.value = false;
}

// When a job finishes, show download button.
watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>

<template>
  <div>
    <PendingContent
      :on="`corpus/${corpusId}/job/sparv`"
      class="flex flex-wrap gap-3 items-start"
    >
      <i18n-t keypath="analysis.help" scope="global" tag="p">
        <template #sparv>
          <a :href="$t('analysis.sparv.url')">Sparv</a>
        </template>
      </i18n-t>

      <ActionButton
        :disabled="isJobRunning || !canRun"
        :class="{ 'button-primary': !exports?.length }"
        @click="!isJobRunning && canRun ? doRunJob() : null"
      >
        <icon :icon="['fas', 'gears']" class="mr-1" />
        {{ !exports?.length ? $t("job.run") : $t("job.rerun") }}
      </ActionButton>

      <div>
        <div v-if="!isJobRunning && exports?.length" class="text-sm">
          <icon icon="circle-info" /> {{ $t("job.rerun.overwrite") }}
        </div>

        <div
          v-if="
            !isJobRunning &&
            (jobState?.korp == 'done' || jobState?.strix == 'done')
          "
          class="text-sm"
        >
          <icon icon="circle-info" /> {{ $t("job.rerun.tools_outdated") }}
        </div>
      </div>
    </PendingContent>

    <div class="mt-4">
      <h3 class="text-lg uppercase">{{ $t("download") }}</h3>
      <p>{{ $t("exports.download.help") }}</p>

      <table v-if="exports?.length">
        <tr>
          <th>{{ $t("file.archive") }}</th>
          <td>
            <PendingContent :on="`corpus/${corpusId}/exports/download`">
              <ActionButton class="button-primary" @click="downloadResult">
                <icon :icon="['fas', 'download']" class="mr-1" />
                {{ getDownloadFilename() }}
              </ActionButton>
            </PendingContent>
          </td>
        </tr>
        <tr>
          <th>{{ $t("file.singles") }}</th>
          <td>
            <router-link :to="`/library/corpus/${corpusId}/exports`">
              {{ $t("show") }}...
            </router-link>
          </td>
        </tr>
      </table>
      <p v-else class="opacity-70 italic">
        {{ $t("exports.download.placeholder") }}
      </p>
    </div>
  </div>
</template>
