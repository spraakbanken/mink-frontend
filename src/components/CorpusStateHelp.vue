<script setup>
import { useCorpusState } from "@/composables/corpusState";
import Help from "./Help.vue";

const { stateHelp } = useCorpusState();
</script>

<template>
  <Help v-if="stateHelp">
    <icon :icon="['far', 'lightbulb']" class="mr-1" />
    {{ stateHelp }}
  </Help>
</template>
