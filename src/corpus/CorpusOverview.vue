<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import { useCorpus } from "./corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ConfigPanel from "@/corpus/config/ConfigPanel.vue";
import SourcesPanel from "@/corpus/sources/SourcesPanel.vue";
import JobStatus from "@/corpus/job/JobStatus.vue";
import AnalysisPanel from "@/corpus/analysis/AnalysisPanel.vue";
import ExplorePanel from "@/corpus/explore/ExplorePanel.vue";
import CorpusStateHelp from "@/corpus/CorpusStateHelp.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";

const corpusId = useCorpusIdParam();
const { isConfigValid } = useCorpus(corpusId);
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-full">
      <CorpusStateHelp :corpus-id="corpusId" />
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox :title="$t('settings')">
        <ConfigPanel :corpus-id="corpusId" />
        <template #controls>
          <RouteButton
            :to="`/library/corpus/${corpusId}/config`"
            :class="{ 'button-primary': !isConfigValid }"
          >
            <PhPencilSimple weight="bold" class="inline mb-1 mr-1" />
            {{ $t("edit") }}
          </RouteButton>
        </template>
      </LayoutBox>

      <LayoutBox :title="$t('sources')">
        <SourcesPanel :corpus-id="corpusId" />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus :corpus-id="corpusId" />
      </LayoutBox>

      <LayoutBox :title="$t('analysis')">
        <AnalysisPanel :corpus-id="corpusId" />
      </LayoutBox>

      <LayoutBox :title="$t('tools')">
        <ExplorePanel :corpus-id="corpusId" />
      </LayoutBox>
    </div>
  </div>
</template>
