<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">Metadata</h4>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/sources`" ref="refSources">
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div v-if="sources">{{ sources.length }} filer</div>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/config`" ref="refConfig">
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div>{{ config ? "Konfigurerad" : "Ej konfigurerad" }}</div>
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
      <div v-if="isJobStarted">{{ jobStatusMessage }}</div>
      <div v-else-if="config" class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200" @click.stop="run">
          Kör
        </ActionButton>
      </div>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <div class="flex-1 text-sm p-2" ref="refExports">
      <h4 class="uppercase text-gray-600 text-base">Resultat</h4>
      <ActionButton
        v-if="exports && exports.length"
        @click="download"
        class="mr-2 bg-green-200 border-green-300"
      >
        Ladda ner
      </ActionButton>
    </div>
  </div>
</template>

<script setup>
import { queueJob } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import useSources from "@/composables/sources";
import useConfig from "@/composables/config";
import useJob from "@/composables/job";
import useExports from "@/composables/exports";
import { computed, ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import ActionButton from "./layout/ActionButton.vue";
import RibbonLink from "./RibbonLink.vue";

const router = useRouter();
const { runJob, loadJob, isJobStarted, isJobRunning, jobStatusMessage } =
  useJob();
const { sources, loadSources } = useSources();
const { config, loadConfig } = useConfig();
const { loadExports, exports, downloadResult } = useExports();

const { corpusId } = useCorpusIdParam();
const refSources = ref(null);
const refConfig = ref(null);
const refStatus = ref(null);
const refExports = ref(null);

onMounted(() => {
  loadSources(refSources.value.$el);
  loadConfig(refConfig.value.$el);
  loadJob(refStatus.value.$el);
  loadExports(refExports.value);
});

async function run() {
  await runJob(refStatus.value.$el);
  router.push(`/corpus/${corpusId.value}/status`);
}

async function download() {
  downloadResult(refExports.value);
}
</script>

<style></style>
