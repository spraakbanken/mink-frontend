<script setup lang="ts">
import useSpin from "@/spin/spin.composable";
import useConfig from "@/corpus/config/config.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import useCorpus from "@/corpus/corpus.composable";
import { useResourceStore } from "@/store/resource.store";

const props = defineProps<{
  id: string;
}>();

const resourceStore = useResourceStore();
const { loadCorpus } = useCorpus(props.id);
const { spin } = useSpin();
const { corpusName } = useConfig(props.id);

const corpus = resourceStore.corpora[props.id];

spin(loadCorpus(), "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ corpusName || id }}</strong>

    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>

    <div class="flex mt-2 text-sm">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
