<script setup lang="ts">
defineProps<{
  subtitle?: string;
}>();
</script>

<template>
  <header class="flex flex-wrap items-end mt-2 mb-4">
    <h1>
      <slot />
    </h1>
    <h2 v-if="subtitle" class="ml-8 text-gray-600 dark:text-zinc-400">
      {{ $t(subtitle) }}
    </h2>
  </header>
</template>
