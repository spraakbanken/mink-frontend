<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <h3 class="text-lg uppercase">Korp</h3>
    <p>{{ $t("exports.korp.help") }}</p>
    <div class="flex flex-wrap gap-2 mb-1">
      <ActionButton
        :variant="isDone && !isInstalled ? 'primary' : null"
        :disabled="!isDone"
        @click="isDone ? korpInstall() : null"
      >
        {{ $t("exports.korp.install") }}
      </ActionButton>

      <a
        v-if="isInstalled"
        :href="`https://spraakbanken.gu.se/korplabb/?mode=mink&corpus=${corpusId}`"
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

    <h3 class="text-lg uppercase mt-4">{{ $t("download") }}</h3>
    <p>{{ $t("exports.download.help") }}</p>

    <div class="flex flex-wrap items-baseline gap-4">
      <ActionButton v-if="exports && exports.length" @click="downloadResult">
        <icon :icon="['far', 'file-zipper']" class="mr-1" />
        {{ $t("download_export") }}
      </ActionButton>

      <router-link
        v-if="exports && exports.length"
        :to="`/corpus/${corpusId}/exports`"
      >
        {{ $t("exports.download.more") }}
      </router-link>
    </div>
  </PendingContent>
</template>

<script setup>
import { watch } from "vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useExports from "./exports.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { exports, loadExports, downloadResult } = useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { install, isInstalled } = useJob(corpusId);

function korpInstall() {
  install();
}

watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>
