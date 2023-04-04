<template>
  <PendingContent
    :on="`corpus/${corpusId}/exports`"
    class="grid grid-cols-2 gap-4"
  >
    <div>
      <h3 class="text-lg uppercase">Korp</h3>
      <p>{{ $t("exports.korp.help") }}</p>
      <div class="flex flex-wrap gap-2 mb-1">
        <ActionButton
          :variant="canInstall ? 'primary' : null"
          :disabled="!canInstall"
          @click="isDone ? korpInstall() : null"
        >
          {{ $t("exports.korp.install") }}
        </ActionButton>

        <a
          v-if="isInstalled"
          :href="`https://spraakbanken.gu.se/korp/?mode=mink#?corpus=${corpusId}`"
          target="_blank"
        >
          <ActionButton variant="primary">
            {{ $t("exports.korp.view") }}
          </ActionButton>
        </a>
        <ActionButton v-else disabled>
          {{ $t("exports.korp.view") }}
        </ActionButton>
      </div>
    </div>

    <div>
      <h3 class="text-lg uppercase">{{ $t("download") }}</h3>
      <p>{{ $t("exports.download.help") }}</p>

      <div class="flex flex-wrap items-baseline gap-4">
        <ActionButton v-if="exports && exports.length" @click="downloadResult">
          <icon :icon="['fas', 'download']" class="mr-1" />
          {{ getDownloadFilename() }}
        </ActionButton>

        <router-link
          v-if="exports && exports.length"
          :to="`/corpus/${corpusId}/exports`"
        >
          {{ $t("exports.download.more") }}
        </router-link>
      </div>
    </div>
  </PendingContent>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useExports from "./exports.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { exports, loadExports, downloadResult, getDownloadFilename } =
  useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { install, isInstalled } = useJob(corpusId);

const isInstallPending = ref(false);
const canInstall = computed(
  () => isDone.value && !isInstalled.value && !isInstallPending.value
);

async function korpInstall() {
  isInstallPending.value = true;
  await install();
  isInstallPending.value = false;
}

// When a job finishes, show download button.
watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>
