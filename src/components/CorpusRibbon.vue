<template>
  <div class="my-4 flex">
    <RibbonLink :to="`/corpus/${corpusId}`">
      <h4 class="uppercase text-gray-600 text-base">{{ $t("metadata") }}</h4>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/sources`">
      <PendingContent :on="`corpus/${corpusId}/sources`">
        <h4 class="uppercase text-gray-600 text-base">{{ $t("text") }}</h4>
        <div v-if="sources && sources.length > 1">
          {{ sources.length }} {{ $t("files") }}
        </div>
        <div v-else-if="sources && sources.length < 2">
          {{ sources.length }} {{ $t("file") }}
        </div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/config`">
      <PendingContent :on="`corpus/${corpusId}/config`">
        <h4 class="uppercase text-gray-600 text-base">
          {{ $t("configuration") }}
        </h4>
        <div>{{ config ? "Konfigurerad" : "Ej konfigurerad" }}</div>
      </PendingContent>
    </RibbonLink>

    <div class="mx-2 self-center">
      <img src="@/assets/right.svg" class="h-10 opacity-75" />
    </div>

    <RibbonLink :to="`/corpus/${corpusId}/status`" :disabled="!isJobStarted">
      <PendingContent :on="`corpus/${corpusId}/job`">
        <h4 class="uppercase text-gray-600 text-base">{{ $t("analysis") }}</h4>
        <div v-if="isJobStarted">{{ $t(jobStatusMessage) }}</div>
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

    <RibbonLink :to="`/corpus/${corpusId}/exports`">
      <PendingContent :on="`corpus/${corpusId}/exports`">
        <h4 class="uppercase text-gray-600 text-base">{{ $t("result") }}</h4>
      </PendingContent>
    </RibbonLink>
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
  // loadConfig();
  loadJob();
  loadExports();
});

async function run() {
  await runJob();
  router.push(`/corpus/${corpusId.value}/status`);
}

// async function download() {
//   downloadResult();
// }
</script>

<style></style>
