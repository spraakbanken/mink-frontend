<script setup lang="ts">
import { computed } from "vue";
import { watchImmediate } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import TextFileBox from "@/components/TextFileBox.vue";
import { getFilenameExtension } from "@/util";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useMessenger from "@/message/messenger.composable";
import useSources from "@/resource/sources.composable";
import type { ResourceType } from "@/api/api.types";
import { isReadable } from "@/file";

const props = defineProps<{
  type: ResourceType;
  id: string;
  filename: string;
}>();

const { sources, downloadSource } = useSources(props.type, props.id);
const { filesize, formatDate } = useLocale();
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const metadata = computed(() =>
  sources.value.find((source) => source.name === props.filename),
);
const isBinary = computed(() => {
  const extension = getFilenameExtension(props.filename);
  return !isReadable(extension);
});
const isXml = computed(() => /\/xml$/.test(metadata.value?.type || ""));

// Show error if given filename is not found
watchImmediate([sources, metadata], () => {
  if (sources.value.length && !metadata.value)
    alert(t("source.notfound"), "error");
});

async function loadFile() {
  return (
    metadata.value &&
    (await downloadSource(metadata.value, isBinary.value).catch(alertError))
  );
}
</script>

<template>
  <LayoutSection :title="filename">
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
            <PendingContent :on="`${id}/sources/${filename}`">
              <TextFileBox
                :load="loadFile"
                :filename="metadata.name"
                :no-load="isBinary"
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
