<script setup lang="ts">
/** View template for listing export files */
import { computed } from "vue";
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
import { groupBy } from "es-toolkit";
import ExportListing from "./ExportListing.vue";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import type { ExportType, FileMeta, ResourceType } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";
import useAlert from "@/alert/alert.composable";
import useExports from "@/exports/exports.composable";
import { useExportStore } from "@/store/export.store";

const props = defineProps<{
  type: ResourceType;
  id: string;
  exportTypes?: ExportType[];
}>();

const { loadExports } = useExportStore();
const { downloadResult, getDownloadFilename } = useExports(
  props.type,
  props.id,
);
const { spin } = useSpin();
const { showAlert } = useAlert();

const exports = computedAsync(() =>
  spin(loadExports(props.type, props.id), `${props.id}/exports/list`),
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
  return (props.exportTypes || []).find((type) =>
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
            @click="downloadResult().catch(showAlert)"
          >
            <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
            {{ getDownloadFilename() }}
          </ActionButton>
        </LayoutBox>
      </PendingContent>

      <LayoutBox v-if="exportGroups" :title="$t('file.singles')">
        <!-- If there are multiple types, show groups in collapsible sections -->
        <template v-if="Object.values(exportGroups).length > 1">
          <details
            v-for="(files, exportType) in exportGroups"
            :key="exportType"
            open
          >
            <summary class="text-lg font-semibold mt-6">
              {{ $t(`exports.type.${exportType || "unknown"}`) }}
            </summary>

            <ExportListing :type :id :files />
          </details>
        </template>

        <!-- Skip sectioning if only one type -->
        <ExportListing v-else :type :id :files="exports || []" />
      </LayoutBox>
    </LayoutSection>
  </PendingContent>
</template>
