<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div>6 MB</div>
      <div>20 dokument</div>
    </RibbonLink>

    <div class="mx-2 text-4xl self-center">〉</div>

    <RibbonLink :to="`/corpus/${corpusId}/config`">
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div v-if="configSummary">{{ configSummary }}</div>
    </RibbonLink>

    <div class="mx-2 text-4xl self-center">〉</div>

    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Analys</h4>
      <div v-if="isJobRunning">{{ jobStatusMessage }}</div>
      <div v-else-if="configSummary" class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200">Kör</ActionButton>
      </div>
    </div>

    <div class="mx-2 text-4xl self-center">〉</div>

    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Export</h4>
    </div>
  </div>
</template>

<script setup>
import { getConfig } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCheckStatus from "@/composables/checkStatus";
import { computed, ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import ActionButton from "./layout/ActionButton.vue";
import RibbonLink from "./RibbonLink.vue";

const route = useRoute();
const store = useStore();
const { loadJob, loadJobTimer, isJobRunning, jobStatusMessage } =
  useCheckStatus(store, route.params.corpusId);

const corpusId = computed(() => route.params.corpusId);
const configSummary = computed(
  () => store.state.corpora[corpusId.value].configSummary
);

spin(getConfig(corpusId.value), "Hämtar konfiguration").then((config) =>
  store.commit("setConfigSummary", {
    corpusId: corpusId.value,
    summary: config ? summarizeConfig(config) : null,
  })
);

loadJob();
onUnmounted(() => clearTimeout(loadJobTimer));

const summarizeConfig = (config) =>
  config.indexOf("text_import:parse") > 0 ? "Plain text" : "XML";
</script>

<style></style>
