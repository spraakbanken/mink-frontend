<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section :title="$t('result')">
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

      <table class="w-full mt-4 striped">
        <thead>
          <tr>
            <th class="w-full">{{ $t("fileName") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
            <th class="text-right">{{ $t("download") }}</th>
          </tr>
        </thead>
        <tbody>
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
    </Section>
  </PendingContent>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import PendingContent from "@/components/PendingContent.vue";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";
import { downloadFile } from "@/util";

const corpusId = useCorpusIdParam();

const { exports, downloadResult, downloadResultFile } = useExports(corpusId);

async function downloadSingle(path) {
  const data = await downloadResultFile(path);
  const filename = path.split("/").pop();
  downloadFile(data, filename);
}

async function downloadFull() {
  const data = await downloadResult();
  downloadFile(data, corpusId + ".zip");
}
</script>

<style></style>
