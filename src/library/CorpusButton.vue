<script setup lang="ts">
import useLocale from "@/i18n/locale.composable";
import useSpin from "@/spin/spin.composable";
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
const { th } = useLocale();

const corpus = resourceStore.corpora[props.id];

spin(loadCorpus(), null, "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/corpus/${id}`">
    <strong>{{ th(corpus.name) || id }}</strong>

    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>

    <div class="flex mt-2 text-sm text-gray-500">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
