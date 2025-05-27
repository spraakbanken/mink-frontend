<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useCorpus } from "./corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import { useCorpusStore } from "@/store/corpus.store";

const corpusStore = useCorpusStore();
const corpusId = useCorpusIdParam();
const { corpusName } = useCorpus(corpusId);

const corpus = computedAsync(() => corpusStore.loadCorpus(corpusId));
</script>

<template>
  <template v-if="corpus">
    <PageTitle subtitle="corpus">
      <router-link
        v-if="$route.path != `/library/corpus/${corpusId}`"
        :to="`/library/corpus/${corpusId}`"
        class="text-inherit no-underline hover:underline"
      >
        {{ corpusName || corpusId }}
      </router-link>
      <template v-else>
        {{ corpusName || corpusId }}
      </template>
    </PageTitle>
    <router-view />
  </template>
</template>
