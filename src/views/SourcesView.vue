<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />

  <Section title="Texter">
    <Sources />
  </Section>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import Section from "@/components/layout/Section.vue";
import Sources from "@/components/Sources.vue";

const { corpusId } = useCorpusIdParam();
</script>

<style></style>
