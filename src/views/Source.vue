<template>
  <Section>
    <h2>{{ filename }}</h2>
    <Section v-if="sourceRaw" :title="$t('source_text')">
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
