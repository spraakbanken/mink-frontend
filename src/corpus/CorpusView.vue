<script setup lang="ts">
import { useCorpus } from "./corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { corpus } = useCorpus(corpusId);
const { th } = useLocale();
</script>

<template>
  <PageTitle subtitle="corpus">
    <router-link
      v-if="$route.path != `/library/corpus/${corpusId}`"
      :to="`/library/corpus/${corpusId}`"
      class="text-inherit no-underline hover:underline"
    >
      {{ th(corpus?.name) || corpusId }}
    </router-link>
    <template v-else>
      {{ th(corpus?.name) || corpusId }}
    </template>
  </PageTitle>
  <router-view />
</template>
