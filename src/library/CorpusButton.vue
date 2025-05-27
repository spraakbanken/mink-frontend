<script setup lang="ts">
import useSpin from "@/spin/spin.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import { useCorpus } from "@/corpus/corpus.composable";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps<{
  id: string;
}>();

const corpusStore = useCorpusStore();
const { spin } = useSpin();
const { corpusName, hasSources, sources } = useCorpus(props.id);

spin(corpusStore.loadCorpus(props.id), "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ corpusName || id }}</strong>

    <span v-if="hasSources">
      {{ $t("files", sources.length) }}
    </span>

    <div class="flex mt-2 text-sm">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
