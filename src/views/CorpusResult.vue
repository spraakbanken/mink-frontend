<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section :title="$t('result')">
      <div v-if="exports.length === 0">
        Waiting for the annotation to complete.
      </div>
      <div v-else>
        <div class="my-4">
          <ActionButton
            v-if="exports && exports.length"
            variant="primary"
            class="mr-2"
            @click="downloadFull"
          >
            <icon :icon="['far', 'file-zipper']" class="mr-1" />
            {{ $t("download_export") }}
          </ActionButton>
        </div>

        <table class="w-full mt-4">
          <thead>
            <tr>
              <th class="w-full">{{ $t("fileName") }}</th>
              <th class="text-right">{{ $t("fileSize") }}</th>
              <th class="text-right">{{ $t("download") }}</th>
            </tr>
          </thead>
          <tbody class="border-b-0">
            <tr v-for="file in exports" :key="file.name">
              <td>
                {{ file.name }}
              </td>
              <td class="text-right whitespace-nowrap">
                {{ (file.size / 1000).toFixed(1) }} KB
              </td>
              <td class="text-right">
                <ActionButton
                  variant="primary"
                  class="mute slim"
                  @click="downloadSingle(file.path)"
                >
                  <icon :icon="['far', 'file-code']" />
                </ActionButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  </PendingContent>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import { onMounted } from "@vue/runtime-core";
import PendingContent from "@/components/PendingContent.vue";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";
import { downloadFile } from "@/util";

const { corpusId } = useCorpusIdParam();
const { loadExports, exports, downloadResult, downloadFileXML } = useExports();

onMounted(() => loadExports());

async function downloadSingle(path) {
  const data = await downloadFileXML(path);
  const filename = path.split("/").pop();
  downloadFile(data, filename);
}

async function downloadFull() {
  const data = await downloadResult();
  downloadFile(data, corpusId.value + ".zip");
}
</script>

<style></style>
