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
    :class="[
      isEmpty || isNeedingConfig || isNeedingMeta
        ? 'text-yellow-500'
        : isFailed
          ? 'text-red-500'
          : isReady
            ? 'text-lime-600'
            : 'text-gray-400',
    ]"
  >
    {{ stateMessage }}
  </span>
</template>
