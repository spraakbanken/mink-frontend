<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { PhDownloadSimple, PhGearFine, PhInfo } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps<{
  corpusId: string;
}>();

const { runJob, loadExports } = useCorpusStore();
const {
  hasMetadata,
  isConfigValid,
  jobState,
  isJobRunning,
  exports,
  clearAnnotations,
  downloadResult,
  getDownloadFilename,
} = useCorpus(props.corpusId);

const isPending = ref(false);
const canRun = computed(
  () =>
    isConfigValid.value &&
    hasMetadata.value &&
    !isPending.value &&
    !isJobRunning.value,
);

loadExports(props.corpusId);

async function doRunJob() {
  isPending.value = true;
  await runJob(props.corpusId);
  isPending.value = false;
}

// When a job finishes, show download button.
watch(jobState, () => {
  if (jobState.value?.sparv == "done") {
    loadExports(props.corpusId);
  }
});
</script>

<template>
  <div>
    <PendingContent
      :on="`corpus/${corpusId}/job/sparv`"
      class="flex flex-col gap-3 items-start"
    >
      <div v-if="exports?.length" class="flex gap-3 items-center">
        <div>
          <div class="font-semibold">{{ $t("annotations.clear") }}</div>
          {{ $t("annotations.clear.help") }}
        </div>
        <ActionButton @click="clearAnnotations()" class="whitespace-nowrap">
          {{ $t("annotations.clear") }}
        </ActionButton>
      </div>

      <div class="flex gap-3 items-center">
        <div>
          <div class="font-semibold">{{ $t("job.run") }}</div>
          <i18n-t keypath="analysis.help" scope="global">
            <template #sparv>
              <a :href="$t('analysis.sparv.url')">Sparv</a>
            </template>
          </i18n-t>
        </div>

        <ActionButton
          :disabled="isJobRunning || !canRun"
          :class="{
            'button-primary': !isJobRunning && canRun && !exports?.length,
          }"
          @click="!isJobRunning && canRun ? doRunJob() : null"
          class="whitespace-nowrap"
        >
          <PhGearFine weight="bold" class="inline mb-1 mr-1" />
          {{ !exports?.length ? $t("job.run") : $t("job.rerun") }}
        </ActionButton>
      </div>

      <div>
        <div v-if="!isJobRunning && exports?.length" class="text-sm">
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.overwrite") }}
        </div>

        <div
          v-if="
            !isJobRunning &&
            (jobState?.korp == 'done' || jobState?.strix == 'done')
          "
          class="text-sm"
        >
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.tools_outdated") }}
        </div>
      </div>
    </PendingContent>

    <PendingContent :on="`corpus/${corpusId}/exports/list`" class="mt-4">
      <h3 class="text-lg uppercase">{{ $t("download") }}</h3>
      <p>{{ $t("exports.download.help") }}</p>

      <table v-if="exports?.length">
        <tr>
          <th>{{ $t("file.archive") }}</th>
          <td>
            <PendingContent :on="`corpus/${corpusId}/exports/download`">
              <ActionButton
                :class="{ 'button-primary': !isJobRunning }"
                @click="downloadResult"
              >
                <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
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
    </PendingContent>
  </div>
</template>
