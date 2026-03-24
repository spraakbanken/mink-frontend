<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import { useAuth } from "@/auth/auth.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const resourceId = useResourceIdParam();
const { canWrite } = useAuth();
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox :title="$t('configuration')">
        <ConfigPanel :resource-id="resourceId" />
        <template #controls>
          <RouteButton :to="`/library/resource/${resourceId}/config`">
            <template v-if="canWrite('corpora', resourceId)">
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
        <SharingPanel resource-type="corpora" :resource-id="resourceId" />
      </LayoutBox>

      <LayoutBox :title="$t('sources')">
        <SourcesPanel :resource-id="resourceId" />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus :resource-id="resourceId" />
      </LayoutBox>

      <LayoutBox :title="$t('analysis')">
        <AnalysisPanel :resource-id="resourceId" />
      </LayoutBox>

      <LayoutBox :title="$t('exports.tools')">
        <ExplorePanel :resource-id="resourceId" />
      </LayoutBox>
    </div>
  </div>
</template>
