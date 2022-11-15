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
        <tr v-if="isText">
          <th>{{ $t("source.content") }}</th>
          <td>
            <SourceText :load="loadRaw" :filename="metadata.name" />
          </td>
        </tr>
        <tr v-if="isText && !isPlaintext">
          <th>{{ $t("txt") }}</th>
          <td>
            <SourceText
              v-if="isJobDone"
              :load="loadPlain"
              :filename="ensureExtension(metadata.name, 'txt')"
            />
            <div class="text-sm py-1">
              {{ $t("source_text_help") }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { ensureExtension, formatDate } from "@/util";
import Section from "@/components/layout/Section.vue";
import useJob from "@/composables/job";
import useSources from "@/composables/sources";
import SourceText from "@/components/SourceText.vue";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const { downloadSource, downloadPlaintext } = useSources(props.corpusId);
const { isJobDone } = useJob(props.corpusId);

const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
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
