<script setup lang="ts">
defineProps<{
  tag?: string;
  title?: string;
}>();
</script>

<template>
  <component
    :is="tag || 'section'"
    class="relative rounded-sm p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 overflow-hidden"
  >
    <div v-if="title || $slots.controls" class="flex justify-between mb-2">
      <h2 v-if="title" class="text-xl font-medium">{{ title }}</h2>
      <div class="items-baseline justify-end gap-2 text-sm">
        <slot name="controls" />
      </div>
    </div>

    <slot />
  </component>
</template>
