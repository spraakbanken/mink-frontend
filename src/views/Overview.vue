<template>
  <div class="flex flex-wrap">
    <div class="md:w-3/5 mb-4 md:pr-2">
      <Panel title="Metadata">
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

      <Panel title="Settings">
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
    <div class="md:w-2/5 mb-4 md:pl-2">
      <Panel title="Status"></Panel>
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

const { corpusId } = useCorpusIdParam();
</script>

<style></style>
