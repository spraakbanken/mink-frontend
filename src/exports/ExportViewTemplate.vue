<script setup lang="ts">
import { computed } from "vue";
import { computedAsync, watchImmediate } from "@vueuse/core";
import TextFileBox from "@/components/TextFileBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useAlert from "@/alert/alert.composable";
import useExports from "@/exports/exports.composable";
import type { ResourceType } from "@/api/api.types";
import { useExportStore } from "@/store/export.store";
import useNotFound from "@/components/notfound.composable";

const props = defineProps<{
  type: ResourceType;
  id: string;
  path: string;
}>();

const { loadExports } = useExportStore();
const { loadResultFile } = useExports(props.type, props.id);
const { filesize, formatDate } = useLocale();
const { showAlert } = useAlert();
const { showNotFoundPage } = useNotFound();

const exports = computedAsync(() => loadExports(props.type, props.id));

const path = computed(() => decodeURIComponent(props.path));
const metadata = computed(() =>
  exports.value?.find((file) => file.path === path.value),
);
const isXml = computed(() => /\/xml$/.test(metadata.value?.type || ""));

// Show error if given filename is not found
watchImmediate([exports, metadata], () => {
  if (exports.value?.length && !metadata.value) showNotFoundPage();
});

async function loadFile() {
  return metadata.value && (await loadResultFile(path.value).catch(showAlert));
}
</script>

<template>
  <LayoutSection>
    <h2>{{ path }}</h2>
    <table v-if="metadata" class="w-full my-4">
      <tbody>
        <tr>
          <th>{{ $t("fileSize") }}</th>
          <td>{{ filesize(metadata.size) }}</td>
        </tr>
        <tr>
          <th>{{ $t("created") }}</th>
          <td>
            {{ formatDate(metadata.last_modified) }}
          </td>
        </tr>
      </tbody>
    </table>

    <h3 class="text-2xl">{{ $t("file.content") }}</h3>
    <PendingContent :on="`${id}/exports/${path}`">
      <TextFileBox
        v-if="metadata"
        :load="loadFile"
        :filename="metadata.name"
        :size="metadata.size"
        :language="isXml ? 'xml' : undefined"
      />
    </PendingContent>
  </LayoutSection>
</template>
