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
          <th>{{ $t("original") }}</th>
          <td>
            <ActionButton @click="downloadRaw">
              <icon :icon="['far', 'file']" class="mr-1" />
              {{ $t("download") }}
            </ActionButton>
          </td>
        </tr>
        <tr v-if="metadata.type != 'text/plain'">
          <th>{{ $t("txt") }}</th>
          <td>
            <ActionButton v-if="isJobDone" @click="downloadPlain">
              <icon :icon="['far', 'file-lines']" class="mr-1" />
              {{ $t("download") }}
            </ActionButton>
            <div class="text-sm py-1">
              {{ $t("source_text_help") }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="bg-white shadow-inner monospace text-sm">{{ sourceRaw }}</div>
  </Section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { downloadFile, ensureExtension, formatDate } from "@/util";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import useJob from "@/composables/job";
import useSources from "@/composables/sources";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const { downloadSource, downloadPlaintext } = useSources();
const { isJobDone } = useJob();

const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
);
const sourceRaw = ref();

const sourceRawPromise = downloadSource(metadata.value).then((data) => {
  sourceRaw.value = data;
});

async function downloadRaw() {
  const data = await sourceRawPromise;
  downloadFile(data, metadata.value.name);
}

async function downloadPlain() {
  const data = await downloadPlaintext(metadata.value);
  downloadFile(data, ensureExtension(metadata.value.name, "txt"));
}
</script>

<style></style>
