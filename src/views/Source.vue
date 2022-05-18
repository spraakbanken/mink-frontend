<template>
  <Section>
    <h2>{{ filename }}</h2>
    <br />
    <span>{{ showText }}</span>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";
import useSpin from "@/assets/spin";

const { spin } = useSpin();

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const showText = computed(() => store.state.txtshow?.content);
const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
);
</script>

<style></style>
