<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import SharingPanel from "../auth/SharingPanel.vue";
import { useCorpus } from "./corpus.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ConfigPanel from "@/corpus/config/ConfigPanel.vue";
import SourcesPanel from "@/sources/SourcesPanel.vue";
import AnalysisPanel from "@/corpus/analysis/AnalysisPanel.vue";
import ExplorePanel from "@/corpus/ExplorePanel.vue";
import CorpusStateHelp from "@/corpus/CorpusStateHelp.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import { useAuth } from "@/auth/auth.composable";
import JobStatusPanel from "@/job/JobStatusPanel.vue";

const id = useResourceIdParam();
const { isConfigValid, updateSourceFormat } = useCorpus(id);
const { canWrite } = useAuth();
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-full">
      <CorpusStateHelp :id />
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox :title="$t('configuration')">
        <ConfigPanel :id />
        <template #controls>
          <RouteButton
            :to="`/library/corpus/${id}/config`"
            :class="{ 'button-primary': !isConfigValid }"
          >
            <template v-if="canWrite('corpus', id)">
              <PhPencilSimple weight="bold" class="inline mb-1 mr-1" />
              {{ $t("edit") }}
            </template>
            <template v-else>
              {{ $t("show_more") }}
            </template>
          </RouteButton>
        </template>
      </LayoutBox>

      <LayoutBox :title="$t('sharing')">
        <SharingPanel resource-type="corpus" :id />
      </LayoutBox>

      <LayoutBox :title="$t('sources')">
        <SourcesPanel type="corpus" :id @upload="updateSourceFormat" />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatusPanel :id />
      </LayoutBox>

      <LayoutBox :title="$t('analysis')">
        <AnalysisPanel :id />
      </LayoutBox>

      <LayoutBox :title="$t('exports.tools')">
        <ExplorePanel :id />
      </LayoutBox>
    </div>
  </div>
</template>
