<template>
  <div v-if="isAuthenticated">
    <PageTitle subtitle="corpus">{{ corpusName || corpusId }}</PageTitle>
    <CorpusRibbon />
    <router-view />
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useJwt } from "@/composables/jwt";

const { requireAuthentication, isAuthenticated } = useJwt();
const { corpusId } = useCorpusIdParam();
const { corpusName } = useConfig();

requireAuthentication();
</script>

<style></style>
