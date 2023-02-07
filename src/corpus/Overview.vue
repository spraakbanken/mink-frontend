<template>
  <div class="flex flex-wrap">
    <div class="w-full">
      <CorpusStateHelp />
    </div>

    <div class="w-full lg:w-1/2 lg:pr-2">
      <Panel :title="$t('metadata')" class="mb-4">
        <Metadata />
        <template #controls>
          <router-link :to="`/corpus/${corpusId}/metadata`">
            <ActionButton :variant="isNeedingMeta ? 'primary' : null">
              <icon :icon="['fas', 'pen']" class="mr-1" />
              {{ $t("edit") }}
            </ActionButton>
          </router-link>
        </template>
      </Panel>

      <Panel :title="$t('configuration')" class="mb-4">
        <Config />
        <template #controls>
          <router-link :to="`/corpus/${corpusId}/config`">
            <ActionButton :variant="isNeedingConfig ? 'primary' : null">
              <icon :icon="['fas', 'pen']" class="mr-1" />
              {{ $t("edit") }}
            </ActionButton>
          </router-link>
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
        <Exports />
      </Panel>
    </div>
  </div>
  <Panel :title="$t('texts')">
    <Sources />
  </Panel>
</template>

<script setup>
import useCorpusIdParam from "./corpusIdParam.composable";
import { useCorpusState } from "./corpusState.composable";
import Metadata from "./config/Metadata.vue";
import Panel from "@/components/Panel.vue";
import ActionButton from "@/components/ActionButton.vue";
import Config from "./config/Config.vue";
import Sources from "./sources/Sources.vue";
import JobStatus from "./job/JobStatus.vue";
import Exports from "./exports/Exports.vue";
import CorpusStateHelp from "./CorpusStateHelp.vue";

const corpusId = useCorpusIdParam();
const { isNeedingConfig, isNeedingMeta } = useCorpusState(corpusId);
</script>

<style></style>
