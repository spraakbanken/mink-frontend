<script setup lang="ts">
defineProps<{
  code: string;
  language?: string;
}>();
</script>

<template>
  <highlightjs
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
