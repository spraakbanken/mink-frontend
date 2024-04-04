<script setup lang="ts">
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ConfigPanel from "@/corpus/config/ConfigPanel.vue";
import SourcesPanel from "@/corpus/sources/SourcesPanel.vue";
import JobStatus from "@/corpus/job/JobStatus.vue";
import ExportsPanel from "@/corpus/exports/ExportsPanel.vue";
import CorpusStateHelp from "@/corpus/CorpusStateHelp.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";

const corpusId = useCorpusIdParam();
const { isNeedingConfig, isNeedingMeta } = useCorpusState(corpusId);
</script>

<template>
  <div class="flex flex-wrap">
    <div class="w-full">
      <CorpusStateHelp />
    </div>

    <div class="w-full lg:w-1/2 lg:pr-2">
      <LayoutBox :title="$t('configuration')" class="mb-4">
        <ConfigPanel />
        <template #controls>
          <RouteButton
            :to="`/library/corpus/${corpusId}/config`"
            :class="{ 'button-primary': isNeedingConfig || isNeedingMeta }"
          >
            <icon :icon="['fas', 'pen']" class="mr-1" />
            {{ $t("edit") }}
          </RouteButton>
        </template>
      </LayoutBox>
    </div>

    <div class="w-full lg:w-1/2 lg:pl-2">
      <LayoutBox
        :title="$t('job.status')"
        class="mb-4 bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus />
      </LayoutBox>

      <LayoutBox :title="$t('result')" class="mb-4">
        <ExportsPanel />
      </LayoutBox>
    </div>
  </div>
  <LayoutBox :title="$t('texts')">
    <SourcesPanel />
  </LayoutBox>
</template>
