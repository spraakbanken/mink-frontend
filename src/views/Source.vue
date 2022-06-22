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
              <img
                src="@/assets/download.svg"
                :alt="$t('download')"
                class="inline h-5 -mt-1"
              />
              {{ $t("download") }}
            </ActionButton>
          </td>
        </tr>
        <tr v-if="metadata.type != 'text/plain' && isJobDone">
          <th>{{ $t("txt") }}</th>
          <td>
            <ActionButton @click="downloadPlain">
              <img
                src="@/assets/download.svg"
                :alt="$t('download')"
                class="inline h-5 -mt-1"
              />
              {{ $t("download") }}
            </ActionButton>
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
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Section from "@/components/layout/Section.vue";
import { downloadFile, ensureExtension, formatDate } from "@/util";
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

async function downloadRaw() {
  const data = await downloadSource(metadata.value);
  downloadFile(data, metadata.value.name);
}

async function downloadPlain() {
  const data = await downloadPlaintext(metadata.value);
  downloadFile(data, ensureExtension(metadata.value.name, "txt"));
}
</script>

<style></style>
