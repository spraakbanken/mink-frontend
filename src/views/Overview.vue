<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-3/5 lg:pr-2">
      <Panel title="Metadata" class="mb-6">
        <Metadata />
        <template #controls>
          <router-link :to="`/corpus/${corpusId}/config`">
            <ActionButton class="text-sm mx-4">
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
            <ActionButton class="text-sm mx-4">
              <icon :icon="['fas', 'pen']" class="mr-1" />
              {{ $t("edit") }}
            </ActionButton>
          </router-link>
        </template>
      </Panel>
    </div>
    <div class="w-full lg:w-2/5 mb-6 lg:pl-2">
      <Panel title="Status">
        <JobStatus />
      </Panel>
    </div>
  </div>
  <Panel title="Texts">
    <Sources />
  </Panel>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import Metadata from "@/components/Metadata.vue";
import Panel from "@/components/layout/Panel.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Config from "@/components/Config.vue";
import Sources from "@/components/Sources.vue";
import JobStatus from "@/components/JobStatus.vue";

const { corpusId } = useCorpusIdParam();
</script>

<style></style>
