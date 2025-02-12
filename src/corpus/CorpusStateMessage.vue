<script setup lang="ts">
import { useCorpusState } from "@/corpus/corpusState.composable";

const props = defineProps<{
  corpusId: string;
}>();

const {
  stateMessage,
  isEmpty,
  isNeedingConfig,
  isNeedingMeta,
  isReady,
  isFailed,
} = useCorpusState(props.corpusId);
</script>

<template>
  <span
    v-if="stateMessage"
    class="text-white rounded-sm px-2 py-0.5"
    :class="[
      isEmpty || isNeedingConfig || isNeedingMeta
        ? 'bg-yellow-700'
        : isFailed
          ? 'bg-red-600'
          : isReady
            ? 'bg-lime-700'
            : 'text-inherit!',
    ]"
  >
    {{ stateMessage }}
  </span>
</template>
