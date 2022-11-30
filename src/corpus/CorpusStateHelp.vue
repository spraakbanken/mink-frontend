<script setup>
import useCorpusIdParam from "./corpusIdParam.composable";
import { useCorpusState } from "./corpusState.composable";
import Help from "@/components/Help.vue";

const corpusId = useCorpusIdParam();
const { stateHelp } = useCorpusState(corpusId);
</script>

<template>
  <Help v-if="stateHelp">
    <icon :icon="['far', 'lightbulb']" class="mr-1" />
    {{ stateHelp }}
  </Help>
</template>
