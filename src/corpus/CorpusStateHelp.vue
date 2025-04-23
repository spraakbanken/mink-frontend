<script setup lang="ts">
import { PhLightbulbFilament } from "@phosphor-icons/vue";
import { useCorpusState } from "@/corpus/corpusState.composable";
import HelpBox from "@/components/HelpBox.vue";

const props = defineProps<{
  corpusId: string;
}>();

const { stateHelp, isActionNeeded } = useCorpusState(props.corpusId);
</script>

<template>
  <HelpBox v-if="stateHelp" :important="isActionNeeded">
    <PhLightbulbFilament weight="bold" class="inline mb-1 mr-1" />
    {{ stateHelp }}
  </HelpBox>
</template>
