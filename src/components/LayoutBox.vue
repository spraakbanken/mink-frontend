<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section
    class="relative rounded-sm p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 overflow-hidden"
  >
    <div class="flex justify-between mb-2">
      <h2 v-if="title" class="text-xl font-semibold uppercase">{{ title }}</h2>
      <div class="items-baseline justify-end gap-2 text-sm">
        <slot name="controls" />
      </div>
    </div>

    <slot />
  </section>
</template>
