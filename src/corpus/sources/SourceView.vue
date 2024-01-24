<script setup lang="ts">
import { computed } from "vue";
import { ensureExtension, formatDate } from "@/util";
import { useCorpusStore } from "@/store/corpus.store";
import Section from "@/components/Section.vue";
import useJob from "@/corpus/job/job.composable";
import useSources from "./sources.composable";
import SourceText from "./SourceText.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";

const props = defineProps<{
  corpusId: string;
  filename: string;
}>();

const corpusStore = useCorpusStore();
const { downloadSource, downloadPlaintext } = useSources(props.corpusId);
const { isJobDone } = useJob(props.corpusId);
const { filesize } = useLocale();

// TODO Handle missing source (e.g. due to user visiting old url)
const metadata = computed(() =>
  corpusStore.corpora[props.corpusId].sources?.find(
    (source) => source.name === props.filename
  )
);
const isBinary = computed(() => metadata.value?.type.indexOf("text/") !== 0);
const isPlaintext = computed(() => metadata.value?.type == "text/plain");

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
  <Section>
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
            <PendingContent :on="`corpus/${corpusId}/sources/${filename}`">
              <SourceText
                :load="loadRaw"
                :filename="metadata.name"
                :no-load="isBinary"
              />
            </PendingContent>
          </td>
        </tr>
        <tr v-if="!isPlaintext">
          <th>{{ $t("txt") }}</th>
          <td>
            <PendingContent :on="`corpus/${corpusId}/sources/${filename}`">
              <SourceText
                v-if="isJobDone"
                :load="loadPlain"
                :filename="ensureExtension(metadata.name, 'txt')"
              />
              <div class="text-sm py-1">
                {{ $t("source_text_help") }}
              </div>
            </PendingContent>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>
