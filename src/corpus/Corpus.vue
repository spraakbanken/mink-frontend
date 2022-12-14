<template>
  <div v-if="isAuthenticated">
    <template v-if="corpusExists">
      <PageTitle subtitle="corpus">
        <router-link :to="`/corpus/${corpusId}`" class="text-inherit">
          {{ corpusName || corpusId }}
        </router-link>
      </PageTitle>
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
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useAuth } from "@/auth/auth.composable";
import useCorpusIdParam from "./corpusIdParam.composable";
import useCorpus from "./corpus.composable.js";
import useConfig from "./config/config.composable";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const corpusId = useCorpusIdParam();
const { loadCorpus } = useCorpus(corpusId);
const { corpusName } = useConfig(corpusId);

const corpusExists = computed(() => !!store.state.corpora[corpusId]);

requireAuthentication().then((ok) => ok && loadCorpus());
</script>

<style></style>
