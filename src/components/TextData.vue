<script setup lang="ts">
import TerminalOutput from "./TerminalOutput.vue";

defineProps<{
  text: string;
}>();
</script>

<template>
  <TerminalOutput class="h-fit max-h-40 resize-y">
    {{ text }}
  </TerminalOutput>
</template>

<style scoped>
/* Override max-height when user is resizing. */
.resize-y[style*="height"] {
  max-height: unset;
}
</style>
