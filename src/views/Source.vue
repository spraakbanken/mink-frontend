<template>
  <Section>
    <h2>{{ filename }}</h2>
    <div
      v-if="showText"
      class="whitespace-pre-wrap border bg-white p-4 my-4 text-gray-600"
    >
      {{ showText }}
    </div>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";
import useSpin from "@/assets/spin";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const { contentViewX } = useExports();
const showText = computed(() => store.state.txtshow?.content);
const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
);

store.commit("removeText");
contentViewX(props.filename);
</script>

<style></style>
