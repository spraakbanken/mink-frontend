<script setup lang="ts">
import useSpin from "@/spin/spin.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import { useResourceStore } from "@/store/resource.store";
import { useCorpus } from "@/corpus/corpus.composable";

const props = defineProps<{
  id: string;
}>();

const resourceStore = useResourceStore();
const { spin } = useSpin();
const { corpusName, hasSources, sources } = useCorpus(props.id);

spin(resourceStore.loadCorpus(props.id), "corpora");
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
