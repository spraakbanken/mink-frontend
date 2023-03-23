<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section :title="$t('result')">
      <Help>
        <p>{{ $t("exports.help") }}</p>
      </Help>

      <div class="my-4">
        {{ $t("download_export") }}:
        <ActionButton
          v-if="exports && exports.length"
          variant="primary"
          class="mr-2"
          @click="downloadResult"
        >
          <icon :icon="['fas', 'download']" class="mr-1" />
          {{ getDownloadFilename() }}
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
              {{ file.path }}
            </td>
            <td class="text-right whitespace-nowrap">
              {{ filesize(file.size) }}
            </td>
            <td class="text-right">
              <ActionButton
                variant="primary"
                class="mute slim"
                @click="downloadResultFile(file.path)"
              >
                <icon :icon="['fas', 'download']" />
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  </PendingContent>
</template>

<script setup>
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import Section from "@/components/Section.vue";
import useExports from "./exports.composable";
import Help from "@/components/Help.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { filesize } = useLocale();
const { exports, downloadResult, downloadResultFile, getDownloadFilename } =
  useExports(corpusId);
</script>

<style></style>
