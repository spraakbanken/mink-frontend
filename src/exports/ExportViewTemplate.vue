<script setup lang="ts">
import { computed } from "vue";
import { computedAsync, watchImmediate } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import TextFileBox from "@/components/TextFileBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useMessenger from "@/message/messenger.composable";
import useExports from "@/exports/exports.composable";
import type { ResourceType } from "@/api/api.types";
import { useExportStore } from "@/store/export.store";

const props = defineProps<{
  type: ResourceType;
  id: string;
  path: string;
}>();

const { loadExports } = useExportStore();
const { loadResultFile } = useExports(props.type, props.id);
const { filesize, formatDate } = useLocale();
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const exports = computedAsync(() => loadExports(props.type, props.id));

const path = computed(() => decodeURIComponent(props.path));
const metadata = computed(() =>
  exports.value?.find((file) => file.path === path.value),
);
const isXml = computed(() => /\/xml$/.test(metadata.value?.type || ""));

// Show error if given filename is not found
watchImmediate([exports, metadata], () => {
  if (exports.value?.length && !metadata.value)
    alert(t("source.notfound"), "error");
});

async function loadFile() {
  return metadata.value && (await loadResultFile(path.value).catch(alertError));
}
</script>

<template>
  <LayoutSection>
    <h2>{{ path }}</h2>
    <table v-if="metadata" class="w-full mt-4">
      <tbody>
        <tr>
          <th>{{ $t("fileSize") }}</th>
          <td>{{ filesize(metadata.size) }}</td>
        </tr>
        <tr>
          <th>{{ $t("uploaded") }}</th>
          <td>
            {{ formatDate(metadata.last_modified) }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("source.content") }}</th>
          <td>
            <PendingContent :on="`${id}/exports/${path}`">
              <TextFileBox
                :load="loadFile"
                :filename="metadata.name"
                :size="metadata.size"
                :language="isXml ? 'xml' : undefined"
              />
            </PendingContent>
          </td>
        </tr>
      </tbody>
    </table>
  </LayoutSection>
</template>
