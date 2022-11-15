<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useCorpusState } from "@/composables/corpusState";
import Help from "./Help.vue";

const corpusId = useCorpusIdParam();
const { stateHelp } = useCorpusState(corpusId);
</script>

<template>
  <Help v-if="stateHelp">
    <icon :icon="['far', 'lightbulb']" class="mr-1" />
    {{ stateHelp }}
  </Help>
</template>
