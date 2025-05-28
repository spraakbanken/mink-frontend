<script setup lang="ts">
import useSpin from "@/spin/spin.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import { useCorpus } from "@/corpus/corpus.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useLocale from "@/i18n/locale.composable";

const props = defineProps<{
  id: string;
}>();

const corpusStore = useCorpusStore();
const { spin } = useSpin();
const { corpus, hasSources, sources } = useCorpus(props.id);
const { th } = useLocale();

const loadPromise = Promise.all([
  corpusStore.loadConfig(props.id),
  corpusStore.loadSources(props.id),
]);
spin(loadPromise, "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ th(corpus?.name) || id }}</strong>

    <span v-if="hasSources">
      {{ $t("files", sources.length) }}
    </span>

    <div class="flex mt-2 text-sm">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
