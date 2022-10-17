<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <h3 class="text-lg uppercase">Korp</h3>
    <p>Use this data in Språkbanken's corpus search tool.</p>
    <a :href="`https://spraakbanken.gu.se/korp`" target="_blank">
      <ActionButton variant="primary" class="mb-1"> View in Korp </ActionButton>
    </a>

    <h3 class="text-lg uppercase mt-4">Download</h3>
    <p>Output XML files can be processed by custom scripts etc.</p>

    <div class="flex flex-wrap items-baseline gap-4">
      <ActionButton v-if="exports && exports.length" @click="downloadFull">
        <icon :icon="['far', 'file-zipper']" class="mr-1" />
        {{ $t("download_export") }}
      </ActionButton>

      <router-link
        v-if="exports && exports.length"
        :to="`/corpus/${corpusId}/exports`"
      >
        More files...
      </router-link>
    </div>
  </PendingContent>
</template>

<script setup>
import { downloadFile } from "@/util";
import useCorpusIdParam from "@/composables/corpusIdParam";
import useExports from "@/composables/exports";
import ActionButton from "./layout/ActionButton.vue";
import PendingContent from "./PendingContent.vue";

const { corpusId } = useCorpusIdParam();
const { loadExports, exports, downloadResult } = useExports();

loadExports();

async function downloadFull() {
  const data = await downloadResult();
  downloadFile(data, corpusId.value + ".zip");
}
</script>
