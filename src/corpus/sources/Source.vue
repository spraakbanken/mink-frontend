<template>
  <Section>
    <h2>{{ filename }}</h2>
    <table class="w-full mt-4">
      <tbody>
        <tr>
          <th>{{ $t("fileSize") }}</th>
          <td>{{ (metadata.size / 1000).toFixed(1) }} KB</td>
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
                :no-load="!isText"
              />
            </PendingContent>
          </td>
        </tr>
        <tr v-if="isText && !isPlaintext">
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

<script setup>
import { computed } from "vue";
import { ensureExtension, formatDate } from "@/util";
import { useCorpusStore } from "@/store/corpus.store";
import Section from "@/components/Section.vue";
import useJob from "@/corpus/job/job.composable";
import useSources from "./sources.composable";
import SourceText from "./SourceText.vue";
import PendingContent from "@/spin/PendingContent.vue";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const corpusStore = useCorpusStore();
const { downloadSource, downloadPlaintext } = useSources(props.corpusId);
const { isJobDone } = useJob(props.corpusId);

const metadata = computed(() =>
  corpusStore
    .getCorpus(props.corpusId)
    .value.sources.find((source) => source.name === props.filename)
);
const isText = computed(() => metadata.value.type.indexOf("text/") === 0);
const isPlaintext = computed(() => metadata.value.type == "text/plain");

async function loadRaw() {
  return await downloadSource(metadata.value);
}

async function loadPlain() {
  return await downloadPlaintext(metadata.value);
}
</script>

<style></style>
