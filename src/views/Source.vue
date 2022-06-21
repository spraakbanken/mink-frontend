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
      </tbody>
    </table>
    <Section v-if="sourceRaw" :title="$t('source_raw')">
      <div class="whitespace-pre-wrap border bg-white p-4 my-4 text-gray-600">
        {{ sourceRaw }}
      </div>
    </Section>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";
import { formatDate } from "@/util";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const { activateSource } = useExports();

const sourceRaw = computed(() => store.state.sourceRaw);
const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
);

activateSource(props.filename);
</script>

<style></style>
