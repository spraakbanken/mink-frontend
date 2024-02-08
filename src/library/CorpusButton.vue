<script setup lang="ts">
import useSpin from "@/spin/spin.composable";
import useConfig from "@/corpus/config/config.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import useCorpus from "@/corpus/corpus.composable";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps<{
  id: string;
}>();

const corpusStore = useCorpusStore();
const { loadCorpus } = useCorpus(props.id);
const { corpusName } = useConfig(props.id);
const { spin } = useSpin();

const corpus = corpusStore.corpora[props.id];

spin(loadCorpus(), null, "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/corpus/${id}`">
    <strong>{{ corpusName || id }}</strong>
    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>
    <div class="flex mt-2 text-sm text-gray-500">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
