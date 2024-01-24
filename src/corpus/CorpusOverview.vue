<script setup lang="ts">
import useCorpusIdParam from "./corpusIdParam.composable";
import { useCorpusState } from "./corpusState.composable";
import MetadataPanel from "./config/MetadataPanel.vue";
import Panel from "@/components/Panel.vue";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import ConfigPanel from "./config/ConfigPanel.vue";
import SourcesPanel from "./sources/SourcesPanel.vue";
import JobStatus from "./job/JobStatus.vue";
import ExportsPanel from "./exports/ExportsPanel.vue";
import CorpusStateHelp from "./CorpusStateHelp.vue";

const corpusId = useCorpusIdParam();
const { isNeedingConfig, isNeedingMeta } = useCorpusState(corpusId);
</script>

<template>
  <div class="flex flex-wrap">
    <div class="w-full">
      <CorpusStateHelp />
    </div>

    <div class="w-full lg:w-1/2 lg:pr-2">
      <Panel :title="$t('configuration')" class="mb-4">
        <ConfigPanel />
        <template #controls>
          <RouteButton
            :to="`/corpus/${corpusId}/config`"
            :class="{ 'button-primary': isNeedingConfig }"
          >
            <icon :icon="['fas', 'pen']" class="mr-1" />
            {{ $t("edit") }}
          </RouteButton>
        </template>
      </Panel>

      <Panel :title="$t('metadata')" class="mb-4">
        <MetadataPanel />
        <template #controls>
          <RouteButton
            v-if="!isNeedingConfig"
            :to="`/corpus/${corpusId}/metadata`"
            :class="{ 'button-primary': isNeedingMeta }"
          >
            <icon :icon="['fas', 'pen']" class="mr-1" />
            {{ $t("edit") }}
          </RouteButton>
          <ActionButton v-else disabled>
            <icon :icon="['fas', 'pen']" class="mr-1" />
            {{ $t("edit") }}
          </ActionButton>
        </template>
      </Panel>
    </div>

    <div class="w-full lg:w-1/2 lg:pl-2">
      <Panel
        :title="$t('job.status')"
        class="mb-4 bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatus />
      </Panel>

      <Panel :title="$t('result')" class="mb-4">
        <ExportsPanel />
      </Panel>
    </div>
  </div>
  <Panel :title="$t('texts')">
    <SourcesPanel />
  </Panel>
</template>
