<script setup lang="ts">
import { computed } from "vue";
import useSources from "@/corpus/sources/sources.composable";
import SourceText from "@/corpus/sources/SourceText.vue";
import { ensureExtension, formatDate } from "@/util";
import { useResourceStore } from "@/store/resource.store";
import LayoutSection from "@/components/LayoutSection.vue";
import useJob from "@/corpus/job/job.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import MessageAlert from "@/message/MessageAlert.vue";

const props = defineProps<{
  corpusId: string;
  filename: string;
}>();

const resourceStore = useResourceStore();
const { downloadSource, downloadPlaintext } = useSources(props.corpusId);
const { isJobDone } = useJob(props.corpusId);
const { filesize } = useLocale();

const sources = computed(() => resourceStore.corpora[props.corpusId].sources);
const metadata = computed(() =>
  sources.value?.find((source) => source.name === props.filename),
);
const isBinary = computed(() => metadata.value?.type.indexOf("text/") !== 0);
const isPlaintext = computed(() => metadata.value?.type == "text/plain");
const isXml = computed(() => /\/xml$/.test(metadata.value?.type || ""));

async function loadRaw() {
  return (
    metadata.value && (await downloadSource(metadata.value, isBinary.value))
  );
}

async function loadPlain() {
  return metadata.value && (await downloadPlaintext(metadata.value));
}
</script>

<template>
  <LayoutSection>
    <h2>{{ filename }}</h2>
    <MessageAlert
      v-if="sources && !metadata"
      :message="$t('source.notfound')"
      level="error"
    />
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
            <PendingContent :on="`corpus/${corpusId}/sources/${filename}/raw`">
              <SourceText
                :load="loadRaw"
                :filename="metadata.name"
                :no-load="isBinary"
                :size="metadata.size"
                :language="isXml ? 'xml' : undefined"
              />
            </PendingContent>
          </td>
        </tr>
        <tr v-if="!isPlaintext">
          <th>{{ $t("txt") }}</th>
          <td>
            <PendingContent
              :on="`corpus/${corpusId}/sources/${filename}/plain`"
            >
              <SourceText
                v-if="isJobDone"
                :load="loadPlain"
                :filename="ensureExtension(metadata.name, 'txt')"
                :size="metadata.size"
              />
              <div class="text-sm py-1">
                {{ $t("source_text_help") }}
              </div>
            </PendingContent>
          </td>
        </tr>
      </tbody>
    </table>
  </LayoutSection>
</template>
