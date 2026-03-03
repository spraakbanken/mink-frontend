<script setup lang="ts">
import { computed } from "vue";
import { watchImmediate } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useCorpus } from "../corpus.composable";
import TextFileBox from "@/components/TextFileBox.vue";
import { getFilenameExtension } from "@/util";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import { READABLE_FORMATS, type FileFormat } from "@/api/corpusConfig";
import useMessenger from "@/message/messenger.composable";

const props = defineProps<{
  id: string;
  filename: string;
}>();

const { downloadSource, sources } = useCorpus(props.id);
const { filesize, formatDate } = useLocale();
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const metadata = computed(() =>
  sources.value?.find((source) => source.name === props.filename),
);
const isBinary = computed(() => {
  const extension = getFilenameExtension(props.filename) as FileFormat;
  return !READABLE_FORMATS.includes(extension);
});
const isXml = computed(() => /\/xml$/.test(metadata.value?.type || ""));

// Show error if given filename is not found
watchImmediate([sources, metadata], () => {
  if (sources.value?.length && !metadata.value)
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
  <LayoutSection>
    <h2>{{ filename }}</h2>
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
