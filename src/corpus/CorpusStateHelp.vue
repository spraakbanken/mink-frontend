<script setup lang="ts">
import useCorpusIdParam from "./corpusIdParam.composable";
import { useCorpusState } from "./corpusState.composable";
import HelpBox from "@/components/HelpBox.vue";

const corpusId = useCorpusIdParam();
const { stateHelp, isActionNeeded } = useCorpusState(corpusId);
</script>

<template>
  <HelpBox v-if="stateHelp" :important="isActionNeeded">
    <icon :icon="['far', 'lightbulb']" class="mr-1" />
    {{ stateHelp }}
  </HelpBox>
</template>
