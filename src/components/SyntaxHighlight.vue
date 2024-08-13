<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Import lib dynamically for chunking
const Highlightjs = defineAsyncComponent(
  async () => (await import("@/highlight")).default.component,
);

defineProps<{
  code: string;
  language?: string;
}>();
</script>

<template>
  <Highlightjs
    :code
    :language
    :autodetect="false"
    class="text-xs rounded whitespace-pre-wrap [overflow-wrap:anywhere]"
  />
</template>

<style>
pre code.hljs {
  @apply p-2 bg-stone-800;
}
</style>
