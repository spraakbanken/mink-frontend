<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">Metadata</h4>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/sources`">
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div v-if="sources">{{ sources.length }} filer</div>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/config`" ref="refConfig">
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div>{{ configSummary || "Ej konfigurerad" }}</div>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink
      :to="`/corpus/${corpusId}/status`"
      :disabled="!isJobStarted"
      ref="refStatus"
    >
      <h4 class="uppercase text-gray-600 text-base">Analys</h4>
      <div v-if="isJobRunning">{{ jobStatusMessage }}</div>
      <div v-else-if="configSummary" class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200" @click="run"
          >Kör</ActionButton
        >
      </div>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <div class="flex-1 text-sm p-2" ref="refExports">
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
import useCorpusIdParam from "@/composables/corpusIdParam";
import useCheckStatus from "@/composables/checkStatus";
import useSources from "@/composables/sources";
import useExports from "@/composables/exports";
import { computed, ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ActionButton from "./layout/ActionButton.vue";
import RibbonLink from "./RibbonLink.vue";

const router = useRouter();
const store = useStore();
const { loadJob, loadJobTimer, isJobStarted, isJobRunning, jobStatusMessage } =
  useCheckStatus();
const { sources } = useSources();
const { loadExports, exports, downloadResult } = useExports();

const { corpusId } = useCorpusIdParam();
const configSummary = computed(
  () => store.state.corpora[corpusId.value].configSummary
);
const refConfig = ref(null);
const refStatus = ref(null);
const refExports = ref(null);

onMounted(() => {
  spin(
    getConfig(corpusId.value),
    "Hämtar konfiguration",
    refConfig.value.$el
  ).then((config) =>
    store.commit("setConfigSummary", {
      corpusId: corpusId.value,
      summary: config ? summarizeConfig(config) : null,
    })
  );
  loadJob(refStatus.value.$el);
  loadExports(refExports.value);
});

onUnmounted(() => clearTimeout(loadJobTimer));

const summarizeConfig = (config) =>
  config.indexOf("text_import:parse") > 0 ? "Plain text" : "XML";

async function run() {
  await spin(
    queueJob(corpusId.value),
    "Lägger analys i kö",
    refStatus.value.$el
  );
  router.push(`/corpus/${corpusId.value}/status`);
}
</script>

<style></style>
