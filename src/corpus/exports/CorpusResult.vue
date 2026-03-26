<script setup lang="ts">
import { computed } from "vue";
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
import { groupBy } from "es-toolkit";
import { useI18n } from "vue-i18n";
import { useCorpus } from "../corpus.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";
import api from "@/api/api";
import LayoutBox from "@/components/LayoutBox.vue";
import type { ExportType, FileMeta } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";
import useMessenger from "@/message/messenger.composable";
import SortableTable from "@/components/SortableTable.vue";

const id = useResourceIdParam();
const { locale } = useI18n();
const { filesize } = useLocale();
const { exports, downloadResult, downloadResultFile, getDownloadFilename } =
  useCorpus(id);
const { spin } = useSpin();
const { alertError } = useMessenger();

/** Export type info */
const exportTypes = computedAsync<ExportType[]>(
  () => spin(api.sparvExports(), `${id}/exports/list`),
  [],
);

/** Export files grouped by export type */
const exportGroups = computed<Record<string, FileMeta[]> | undefined>(() => {
  if (!exports.value?.length) return undefined;
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
  <PendingContent :on="`${id}/exports/list`">
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

      <PendingContent :on="`${id}/exports/download`" class="my-4">
        <LayoutBox v-if="exports && exports.length" :title="$t('file.archive')">
          {{ $t("download_export") }}:
          <ActionButton
            class="button-primary mr-2"
            @click="downloadResult().catch(alertError)"
          >
            <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
            {{ getDownloadFilename() }}
          </ActionButton>
        </LayoutBox>
      </PendingContent>

      <LayoutBox v-if="exportGroups" :title="$t('file.singles')">
        <!-- One heading per export type -->
        <details v-for="(files, type) in exportGroups" :key="type" open>
          <summary class="text-lg font-semibold mt-6">
            {{ $t(`exports.type.${type || "unknown"}`) }}
          </summary>

          <SortableTable
            :columns="[
              {
                title: $t('filename'),
                comparator: (a, b) => a.name.localeCompare(b.name, locale),
              },
              {
                title: $t('fileSize'),
                thClass: 'text-end',
                comparator: (a, b) => a.size - b.size,
              },
              { title: $t('file.operations'), thClass: 'sr-only' },
            ]"
            :rows="files"
            :get-row-key="(file) => file.name"
            class="w-full mt-2 striped"
          >
            <template v-slot="{ row: file }">
              <!-- Filename link -->
              <td class="w-full">
                {{ file.path.slice(0, file.path.lastIndexOf("/") + 1)
                }}<router-link
                  :to="`/library/corpus/${id}/exports/${encodeURIComponent(file.path)}`"
                >
                  {{ file.name }}
                </router-link>
              </td>

              <!-- File size -->
              <td class="text-end whitespace-nowrap">
                {{ filesize(file.size) }}
              </td>

              <!-- Download button -->
              <td>
                <ActionButton
                  class="button-slim"
                  @click="downloadResultFile(file.path).catch(alertError)"
                >
                  <PhDownloadSimple class="inline mb-0.5" />
                  <span class="sr-only">{{ $t("download") }}</span>
                </ActionButton>
              </td>
            </template>
          </SortableTable>
        </details>
      </LayoutBox>
    </LayoutSection>
  </PendingContent>
</template>
