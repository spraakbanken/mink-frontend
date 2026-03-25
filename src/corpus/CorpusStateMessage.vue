<script setup lang="ts">
import { useCorpusState } from "@/corpus/corpusState.composable";

const props = defineProps<{
  id: string;
}>();

const { corpusState, isIncomplete, isError, isReady } = useCorpusState(
  props.id,
);
</script>

<template>
  <span
    class="rounded-sm py-0.5"
    :class="{
      'text-white px-2': isIncomplete || isError || isReady,
      'bg-lime-700': isReady,
      'bg-yellow-700': isIncomplete,
      'bg-red-600': isError,
    }"
  >
    {{ $t(`corpus.state.${corpusState}`) }}
  </span>
</template>
