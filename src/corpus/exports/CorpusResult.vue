<script setup lang="ts">
import { computed } from "vue";
import { groupBy } from "es-toolkit";
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { filesize } = useLocale();
const { exports, downloadResult, downloadResultFile, getDownloadFilename } =
  useCorpus(corpusId);

const exportsByFolder = computed(() =>
  exports.value
    ? groupBy(exports.value, (meta) => meta.path.split("/").shift()!)
    : undefined,
);
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/exports/list`">
    <LayoutSection :title="$t('result')">
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

      <PendingContent :on="`corpus/${corpusId}/exports/download`" class="my-4">
        {{ $t("download_export") }}:
        <ActionButton
          v-if="exports && exports.length"
          class="button-primary mr-2"
          @click="downloadResult"
        >
          <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
          {{ getDownloadFilename() }}
        </ActionButton>
      </PendingContent>

      <table class="w-full mt-4 striped">
        <!-- Table header -->
        <thead>
          <tr>
            <th class="w-full">{{ $t("filename") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
            <th class="sr-only">
              {{ $t("file.operations") }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(exports_, folder) in exportsByFolder" :key="folder">
            <!-- Folder row -->
            <tr>
              <td colspan="3">{{ folder }}/</td>
            </tr>

            <!-- File row -->
            <tr v-for="file in exports_" :key="file.name">
              <!-- Filename link -->
              <td class="pl-6!">
                <router-link
                  :to="`/library/corpus/${corpusId}/exports/${encodeURIComponent(file.path)}`"
                >
                  {{ file.name }}
                </router-link>
              </td>

              <!-- File size -->
              <td class="text-right whitespace-nowrap">
                {{ filesize(file.size) }}
              </td>

              <!-- Download button -->
              <td>
                <ActionButton
                  class="button-mute button-slim"
                  @click="downloadResultFile(file.path)"
                >
                  <PhDownloadSimple class="inline mb-0.5" />
                  <span class="sr-only">{{ $t("download") }}</span>
                </ActionButton>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </LayoutSection>
  </PendingContent>
</template>
