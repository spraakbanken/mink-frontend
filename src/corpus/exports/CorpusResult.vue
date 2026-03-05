<script setup lang="ts">
import { computed } from "vue";
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
import { groupBy } from "es-toolkit";
import { useCorpus } from "../corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";
import api from "@/api/api";
import LayoutBox from "@/components/LayoutBox.vue";
import type { ExportType, FileMeta } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";

const corpusId = useCorpusIdParam();
const { filesize } = useLocale();
const { exports, downloadResult, downloadResultFile, getDownloadFilename } =
  useCorpus(corpusId);
const { spin } = useSpin();

/** Export type info */
const exportTypes = computedAsync<ExportType[]>(
  () => spin(api.sparvExports(), `corpus/${corpusId}/exports/list`),
  [],
);

/** Export files grouped by export type */
const exportGroups = computed<Record<string, FileMeta[]> | undefined>(() => {
  if (!exports.value.length) return undefined;
  return groupBy(
    exports.value,
    (file) => identifyType(file.path)?.export || "",
  );
});

/** "folder/filename.ext" -> "folder/__.ext" */
const getPathTemplate = (path: string): string =>
  path.replace(/\/[^/]+\./, "__");

/** Find an export type with a path template that matches the given file path */
function identifyType(path: string): ExportType | undefined {
  return exportTypes.value.find((type) =>
    type.export_files.some(
      (exportPath) => getPathTemplate(exportPath) == getPathTemplate(path),
    ),
  );
}
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
        <LayoutBox v-if="exports && exports.length" :title="$t('file.archive')">
          {{ $t("download_export") }}:
          <ActionButton class="button-primary mr-2" @click="downloadResult">
            <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
            {{ getDownloadFilename() }}
          </ActionButton>
        </LayoutBox>
      </PendingContent>

      <LayoutBox v-if="exportGroups" :title="$t('file.singles')">
        <!-- One heading per export type -->
        <template v-for="(files, type) in exportGroups" :key="type">
          <h2 class="text-lg font-semibold mt-6">
            {{ $t(`exports.type.${type || "unknown"}`) }}
          </h2>

          <table class="w-full mt-2 striped">
            <!-- Table header -->
            <thead>
              <tr>
                <th>{{ $t("filename") }}</th>
                <th class="text-right">{{ $t("fileSize") }}</th>
                <th class="sr-only">
                  {{ $t("file.operations") }}
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- Repeated file row -->
              <tr v-for="file in files" :key="file.name">
                <!-- Filename link -->
                <td class="w-full">
                  {{ file.path.slice(0, file.path.lastIndexOf("/") + 1)
                  }}<router-link
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
                    class="button-slim"
                    @click="downloadResultFile(file.path)"
                  >
                    <PhDownloadSimple class="inline mb-0.5" />
                    <span class="sr-only">{{ $t("download") }}</span>
                  </ActionButton>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </LayoutBox>
    </LayoutSection>
  </PendingContent>
</template>
