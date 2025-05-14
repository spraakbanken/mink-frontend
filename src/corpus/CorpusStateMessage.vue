<script setup lang="ts">
import { useCorpusState } from "@/corpus/corpusState.composable";

const props = defineProps<{
  corpusId: string;
}>();

const { corpusState, isIncomplete, isError, isReady } = useCorpusState(
  props.corpusId,
);
</script>

<template>
  <span
    class="text-white rounded-sm px-2 py-0.5"
    :class="[
      isIncomplete
        ? 'bg-yellow-700'
        : isError
          ? 'bg-red-600'
          : isReady
            ? 'bg-lime-700'
            : 'text-inherit!',
    ]"
  >
    {{ $t(`corpus.state.${corpusState}`) }}
  </span>
</template>
