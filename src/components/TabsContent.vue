<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section
    :aria-label="title"
    class="relative rounded-b-sm p-2 bg-white dark:bg-zinc-900 border border-t-0 border-zinc-100 dark:border-zinc-700 overflow-hidden"
  >
    <slot />
  </section>
</template>
