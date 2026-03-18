<script setup lang="ts">
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import { useCorpusStore } from "@/store/corpus.store";
import { computedAsync } from "@vueuse/core";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";

const corpusId = useCorpusIdParam();
const { loadCorpus } = useCorpusStore();
const { th } = useLocale();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const corpus = computedAsync(() =>
  loadCorpus(corpusId).catch(handle404).catch(alertError),
);
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
  <router-view v-if="corpus" />
</template>
