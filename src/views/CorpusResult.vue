<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section :title="$t('result')">
      <div v-if="exports.length === 0">
        Waiting for the annotation to complete.
      </div>
      <div v-else>
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
                  class="mute slim hover:bg-green-200"
                  @click="downloadSingle(file.path)"
                >
                  <img src="@/assets/xml-file.svg" class="h-7 opacity-75" />
                </ActionButton>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <ActionButton
          v-if="exports && exports.length"
          class="mr-2 bg-green-200 border-green-300"
          @click="downloadFull"
        >
          <div class="flex">
            {{ $t("download_export") }}
            <img src="@/assets/zip.svg" class="h-5 opacity-75 pl-2" />
          </div>
        </ActionButton>
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
