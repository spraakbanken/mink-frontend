<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div v-if="sources">{{ sources.length }} filer</div>
    </RibbonLink>

    <div class="mx-2 text-4xl self-center">〉</div>

    <RibbonLink :to="`/corpus/${corpusId}/config`">
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div>{{ configSummary || "Ej konfigurerad" }}</div>
    </RibbonLink>

    <div class="mx-2 text-4xl self-center">〉</div>

    <RibbonLink :to="`/corpus/${corpusId}/status`" :disabled="!isJobStarted">
      <h4 class="uppercase text-gray-600 text-base">Analys</h4>
      <div v-if="isJobRunning">{{ jobStatusMessage }}</div>
      <div v-else-if="configSummary" class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200" @click="run"
          >Kör</ActionButton
        >
      </div>
    </RibbonLink>

    <div class="mx-2 text-4xl self-center">〉</div>

    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Resultat</h4>
      <ActionButton
        v-if="exports && exports.length"
        @click="downloadResult"
        class="mr-2 bg-green-200 border-green-300"
      >
        Ladda ner
      </ActionButton>
    </div>
  </div>
</template>

<script setup>
import { getConfig } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCheckStatus from "@/composables/checkStatus";
import useSources from "@/composables/sources";
import useExports from "@/composables/exports";
import { computed, ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ActionButton from "./layout/ActionButton.vue";
import RibbonLink from "./RibbonLink.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { loadJob, loadJobTimer, isJobStarted, isJobRunning, jobStatusMessage } =
  useCheckStatus();
const { sources } = useSources();
const { loadExports, exports, downloadResult } = useExports();

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
loadExports();

const summarizeConfig = (config) =>
  config.indexOf("text_import:parse") > 0 ? "Plain text" : "XML";

async function run() {
  await spin(queueJob(corpusId.value), "Lägger analys i kö");
  router.push(`/corpus/${corpusId.value}/status`);
}
</script>

<style></style>
