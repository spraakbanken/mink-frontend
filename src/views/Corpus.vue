<template>
  <div v-if="isAuthenticated">
    <template v-if="corpusExists">
      <PageTitle subtitle="corpus">{{ corpusName || corpusId }}</PageTitle>
      <router-view />
    </template>
    <template v-else>
      <PageTitle>Not found</PageTitle>
      <div class="bg-red-100 text-red-900 p-2 px-4 my-1">
        The corpus with id
        <code>{{ corpusId }}</code> does not exist, or you do not have access to
        it.
      </div>
    </template>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useJwt } from "@/composables/jwt";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

const { requireAuthentication, isAuthenticated } = useJwt();
const { corpusId } = useCorpusIdParam();
const { corpusName } = useConfig();
const store = useStore();

const corpusExists = computed(() => !!store.state.corpora[corpusId.value]);

requireAuthentication();
</script>

<style></style>
