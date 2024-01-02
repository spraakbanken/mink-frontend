<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section :title="$t('result')">
      <HelpBox>
        <p>{{ $t("exports.help") }}</p>
        <aside>
          <a
            href="https://spraakbanken.gu.se/en/tools/mink/manual#download-results"
          >
            {{ $t("exports.help.more.label") }}
          </a>
        </aside>
      </HelpBox>

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in exports" :key="file.name">
            <td>
              <a href="#" @click.prevent="downloadResultFile(file.path)">
                <icon :icon="['fas', 'download']" />
                {{ file.path }}
              </a>
            </td>
            <td class="text-right whitespace-nowrap">
              {{ filesize(file.size) }}
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
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { filesize } = useLocale();
const {
  loadExports,
  exports,
  downloadResult,
  downloadResultFile,
  getDownloadFilename,
} = useExports(corpusId);

loadExports();
</script>

<style></style>
