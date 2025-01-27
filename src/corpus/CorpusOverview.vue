<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ConfigPanel from "@/corpus/config/ConfigPanel.vue";
import SourcesPanel from "@/corpus/sources/SourcesPanel.vue";
import JobStatus from "@/corpus/job/JobStatus.vue";
import AnalysisPanel from "@/corpus/analysis/AnalysisPanel.vue";
import ExplorePanel from "@/corpus/explore/ExplorePanel.vue";
import CorpusStateHelp from "@/corpus/CorpusStateHelp.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";

const corpusId = useCorpusIdParam();
const { isNeedingConfig, isNeedingMeta } = useCorpusState(corpusId);
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-full">
      <CorpusStateHelp />
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox :title="$t('settings')">
        <ConfigPanel />
        <template #controls>
          <RouteButton
            :to="`/library/corpus/${corpusId}/config`"
            :class="{ 'button-primary': isNeedingConfig || isNeedingMeta }"
          >
            <PhPencilSimple weight="bold" class="inline mb-1 mr-1" />
            {{ $t("edit") }}
          </RouteButton>
        </template>
      </LayoutBox>

      <LayoutBox :title="$t('texts')">
        <SourcesPanel />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus />
      </LayoutBox>

      <LayoutBox :title="$t('analysis')">
        <AnalysisPanel />
      </LayoutBox>

      <LayoutBox :title="$t('tools')">
        <ExplorePanel />
      </LayoutBox>
    </div>
  </div>
</template>
