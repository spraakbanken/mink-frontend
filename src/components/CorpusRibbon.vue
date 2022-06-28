<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">
        {{ $t("metadata") }}
      </h4>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" alt="" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/sources`">
      <PendingContent :on="`corpus/${corpusId}/sources`">
        <h4 class="uppercase text-gray-600 text-base">{{ $t("texts") }}</h4>
        <div v-if="sources">
          {{ $t("files", sources.length) }}
        </div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" alt="" class="h-10 opacity-75" />
    </div>

    <RibbonLink
      :to="`/corpus/${corpusId}/status`"
      :disabled="!sources || !sources.length"
    >
      <PendingContent :on="`corpus/${corpusId}/job`">
        <h4 class="uppercase text-gray-600 text-base">
          {{ $t("analysis") }}
        </h4>
        <div v-if="isJobStarted">{{ $t(jobStatusMessage) }}</div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" alt="" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/exports`" :disabled="!isJobDone">
      <PendingContent :on="`corpus/${corpusId}/exports`">
        <h4 class="uppercase text-gray-600 text-base">
          {{ $t("result") }}
        </h4>
      </PendingContent>
    </RibbonLink>
  </div>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import useSources from "@/composables/sources";
import useJob from "@/composables/job";
import useExports from "@/composables/exports";
import RibbonLink from "./RibbonLink.vue";
import PendingContent from "./PendingContent.vue";

const { loadJob, isJobStarted, isJobDone, jobStatusMessage } = useJob();
const { sources, loadSources } = useSources();
const { loadExports } = useExports();

const { corpusId } = useCorpusIdParam();

loadSources();
loadJob();
loadExports();
</script>

<style></style>
