<script setup lang="ts">
import TerminalOutput from "./TerminalOutput.vue";

defineProps<{
  text: string;
  height?: number;
}>();
</script>

<template>
  <div
    class="relative bg-zinc-700 dark:bg-zinc-600 rounded shadow-inner text-sm"
  >
    <TerminalOutput class="h-fit max-h-40 resize-y">
      {{ text }}
    </TerminalOutput>
  </div>
</template>

<style scoped>
/* Override max-height when user is resizing. */
.resize-y[style*="height"] {
  max-height: unset;
}
</style>
