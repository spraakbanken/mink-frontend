<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";

const id = useResourceIdParam();
const { loadCorpus } = useCorpusStore();
const { th } = useLocale();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const corpus = computedAsync(() =>
  loadCorpus(id).catch(handle404).catch(alertError),
);
</script>

<template>
  <PageTitle subtitle="corpus">
    <router-link
      v-if="$route.path != `/library/corpus/${id}`"
      :to="`/library/corpus/${id}`"
      class="text-inherit no-underline hover:underline"
    >
      {{ th(corpus?.name) || id }}
    </router-link>
    <template v-else>
      {{ th(corpus?.name) || id }}
    </template>
  </PageTitle>
  <router-view v-if="corpus" />
</template>
