<script setup lang="ts">
import HeightResizable from "@/components/HeightResizable.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";
import type { SyntaxLanguage } from "@/highlight";

defineProps<{
  text: string;
  language?: SyntaxLanguage;
}>();
</script>

<template>
  <HeightResizable>
    <SyntaxHighlight v-if="language" :code="text" :language />
    <TerminalOutput v-else>{{ text }}</TerminalOutput>
  </HeightResizable>
</template>

<style scoped>
/* Override max-height when user is resizing. */
.resize-y[style*="height"] {
  max-height: unset;
}
</style>
