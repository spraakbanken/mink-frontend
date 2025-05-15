<script setup lang="ts">
import { PhLightbulbFilament } from "@phosphor-icons/vue";
import { useCorpusState } from "@/corpus/corpusState.composable";
import HelpBox from "@/components/HelpBox.vue";

const props = defineProps<{
  corpusId: string;
}>();

const { corpusState, isIncomplete, isError } = useCorpusState(props.corpusId);
</script>

<template>
  <HelpBox :important="isIncomplete || isError">
    <PhLightbulbFilament weight="bold" class="inline mb-1 mr-1" />
    {{ $t(`corpus.state.help.${corpusState}`) }}
  </HelpBox>
</template>
