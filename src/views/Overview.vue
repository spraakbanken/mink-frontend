<template>
  <div class="flex flex-wrap">
    <div class="w-full">
      <CorpusStateHelp />
    </div>

    <div class="w-full lg:w-1/2 lg:pr-2">
      <Panel :title="t('metadata')" class="mb-4">
        <Metadata />
        <template #controls>
          <router-link :to="`/corpus/${corpusId}/config`">
            <ActionButton :variant="isUnconfigured ? 'primary' : null">
              <icon :icon="['fas', 'pen']" class="mr-1" />
              {{ $t("edit") }}
            </ActionButton>
          </router-link>
        </template>
      </Panel>

      <Panel :title="t('configuration')" class="mb-4">
        <Config />
        <template #controls>
          <router-link :to="`/corpus/${corpusId}/config`">
            <ActionButton :variant="isUnconfigured ? 'primary' : null">
              <icon :icon="['fas', 'pen']" class="mr-1" />
              {{ $t("edit") }}
            </ActionButton>
          </router-link>
        </template>
      </Panel>
    </div>

    <div class="w-full lg:w-1/2 lg:pl-2">
      <Panel :title="t('job.status')" class="mb-4 bg-zinc-700 text-white">
        <JobStatus />
      </Panel>

      <Panel :title="t('result')" class="mb-4">
        <Exports />
      </Panel>
    </div>
  </div>
  <Panel :title="t('texts')">
    <Sources />
  </Panel>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useCorpusState } from "@/composables/corpusState";
import Metadata from "@/components/Metadata.vue";
import Panel from "@/components/layout/Panel.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Config from "@/components/Config.vue";
import Sources from "@/components/Sources.vue";
import JobStatus from "@/components/JobStatus.vue";
import Exports from "@/components/Exports.vue";
import CorpusStateHelp from "@/components/CorpusStateHelp.vue";

const { t } = useI18n();
const corpusId = useCorpusIdParam();
const { isUnconfigured } = useCorpusState(corpusId);
</script>

<style></style>
