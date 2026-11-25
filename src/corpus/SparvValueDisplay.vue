<script lang="ts" setup>
import type { SparvValue } from "./sparv";
import SparvValueDefaultDisplay from "./SparvValueDefaultDisplay.vue";
import SparvValueLexDisplay from "./SparvValueLexDisplay.vue";
import SparvValueSenseDisplay from "./SparvValueSenseDisplay.vue";

const props = defineProps<{
  type: string;
  value: SparvValue;
}>();

const { main, parts, score } = props.value;

const component = (() => {
  if (props.type == "lex" || props.type == "complemgram")
    return SparvValueLexDisplay;
  if (props.type == "sense") return SparvValueSenseDisplay;
  return SparvValueDefaultDisplay;
})();
</script>

<template>
  <div>
    <component v-if="!parts" :is="component" :value="main" />

    <template v-for="(part, i) in parts" :key="i">
      <template v-if="i > 0"> + </template>
      <component :is="component" :value="part" />
    </template>

    <template v-if="score">
      {{}}
      <span class="opacity-70 whitespace-nowrap">({{ score }})</span>
    </template>
  </div>
</template>
