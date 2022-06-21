<template>
  <PageTitle subtitle="corpus">{{ corpusName || corpusId }}</PageTitle>
  <CorpusRibbon />
  <router-view />
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";

const { corpusId } = useCorpusIdParam();
const { corpusName } = useConfig();
</script>

<style></style>
