<script setup lang="ts">
defineProps<{
  subtitle?: string;
}>();
</script>

<template>
  <h1 class="flex flex-wrap items-end mt-2 mb-4">
    <span>
      <slot />
    </span>
    <span
      v-if="subtitle"
      class="ml-8 text-3xl text-gray-600 dark:text-zinc-400"
    >
      {{ $t(subtitle) }}
    </span>
  </h1>
</template>
