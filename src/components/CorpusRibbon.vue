<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">Metadata</h4>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/sources`">
      <PendingContent :on="`corpus/${corpusId}/sources`">
        <h4 class="uppercase text-gray-600 text-base">Texter</h4>
        <div v-if="sources">{{ sources.length }} filer</div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/config`">
      <PendingContent :on="`corpus/${corpusId}/config`">
        <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
        <div>{{ config ? "Konfigurerad" : "Ej konfigurerad" }}</div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/status`" :disabled="!isJobStarted">
      <PendingContent :on="`corpus/${corpusId}/status`">
        <h4 class="uppercase text-gray-600 text-base">Analys</h4>
        <div v-if="isJobStarted">{{ jobStatusMessage }}</div>
        <div v-else-if="config" class="flex justify-center items-center">
          <ActionButton class="bg-blue-100 border-blue-200" @click.stop="run">
            Kör
          </ActionButton>
        </div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <div class="flex-1 text-sm p-2">
      <PendingContent :on="`corpus/${corpusId}/exports`">
        <h4 class="uppercase text-gray-600 text-base">Resultat</h4>
        <ActionButton
          v-if="exports && exports.length"
          @click="download"
          class="mr-2 bg-green-200 border-green-300"
        >
          Ladda ner
        </ActionButton>
      </PendingContent>
    </div>
  </div>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import useSources from "@/composables/sources";
import useConfig from "@/composables/config";
import useJob from "@/composables/job";
import useExports from "@/composables/exports";
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import ActionButton from "./layout/ActionButton.vue";
import RibbonLink from "./RibbonLink.vue";
import PendingContent from "./PendingContent.vue";

const router = useRouter();
const { runJob, loadJob, isJobStarted, isJobRunning, jobStatusMessage } =
  useJob();
const { sources, loadSources } = useSources();
const { config, loadConfig } = useConfig();
const { loadExports, exports, downloadResult } = useExports();

const { corpusId } = useCorpusIdParam();

onMounted(() => {
  loadSources();
  loadConfig();
  loadJob();
  loadExports();
});

async function run() {
  await runJob();
  router.push(`/corpus/${corpusId.value}/status`);
}

async function download() {
  downloadResult();
}
</script>

<style></style>
