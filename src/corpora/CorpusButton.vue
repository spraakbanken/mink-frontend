<template>
  <PadButton class="flex">
    <strong>{{ corpusName || id }}</strong>
    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>
    <div class="flex mt-2 text-sm text-gray-500">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>

<script setup>
import useConfig from "@/corpus/config/config.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import useCorpus from "@/corpus/corpus.composable";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps({
  id: {
    type: String,
    required: true,
    validator: (x) => x,
  },
});

const corpusStore = useCorpusStore();
const { loadCorpus } = useCorpus(props.id);
const { corpusName } = useConfig(props.id);

const corpus = corpusStore.corpora[props.id];

loadCorpus();
</script>
