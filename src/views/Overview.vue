<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-3/5 lg:pr-2">
      <Panel title="Metadata" class="mb-6">
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

      <Panel title="Settings" class="mb-6">
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

    <div class="w-full lg:w-2/5 lg:pl-2">
      <Panel title="Status" class="mb-6 bg-zinc-700 text-white">
        <JobStatus />
      </Panel>

      <Panel title="Output" class="mb-6">
        <Exports />
      </Panel>
    </div>
  </div>
  <Panel title="Texts">
    <Sources />
  </Panel>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useCorpusState } from "@/composables/corpusState";
import Metadata from "@/components/Metadata.vue";
import Panel from "@/components/layout/Panel.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Config from "@/components/Config.vue";
import Sources from "@/components/Sources.vue";
import JobStatus from "@/components/JobStatus.vue";
import Exports from "@/components/Exports.vue";

const { corpusId } = useCorpusIdParam();
const { isUnconfigured } = useCorpusState();
</script>

<style></style>
