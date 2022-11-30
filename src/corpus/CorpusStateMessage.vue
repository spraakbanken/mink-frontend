<template>
  <span
    v-if="stateMessage"
    :class="[
      isEmpty || isUnconfigured
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

<script setup>
import { useCorpusState } from "./corpusState.composable";

const props = defineProps({
  corpusId: {
    type: String,
    required: true,
    validate: (x) => x,
  },
});

const { stateMessage, isEmpty, isUnconfigured, isReady, isFailed } =
  useCorpusState(props.corpusId);
</script>
