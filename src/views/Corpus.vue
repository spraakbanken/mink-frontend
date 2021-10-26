<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />
  <router-view />
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import useCorpusIdParam from "@/composables/corpusIdParam";

const { corpusId } = useCorpusIdParam();
</script>

<style></style>
