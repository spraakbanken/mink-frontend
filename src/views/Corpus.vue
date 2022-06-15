<template>
  <PageTitle subtitle="corpus">{{ corpusName }}</PageTitle>
  <CorpusRibbon />
  <router-view />
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import useConfig from "@/composables/config";

const { corpusName } = useConfig();
</script>

<style></style>
