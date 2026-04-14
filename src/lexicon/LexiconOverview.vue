<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import ConfigPanel from "./config/ConfigPanel.vue";
import { useAuth } from "@/auth/auth.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SharingPanel from "@/auth/SharingPanel.vue";
import SourcesPanel from "@/sources/SourcesPanel.vue";

const id = useResourceIdParam();
const { canWrite } = useAuth();
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox :title="$t('configuration')">
        <ConfigPanel :id />
        <template #controls>
          <RouteButton :to="`/library/resource/${id}/config`">
            <template v-if="canWrite('lexica', id)">
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
        <SharingPanel resource-type="lexica" :id />
      </LayoutBox>

      <LayoutBox :title="$t('source_file')">
        <SourcesPanel type="lexicon" :id />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus :id />
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
