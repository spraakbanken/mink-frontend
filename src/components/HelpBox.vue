<script setup lang="ts">
defineProps<{
  important?: boolean;
}>();
</script>

<template>
  <div
    class="my-2 rounded-sm p-2 px-3 max-w-(--breakpoint-sm)"
    :class="
      important
        ? 'bg-blue-100 border-2 border-blue-300 dark:bg-sky-900 dark:border-0 dark:text-sky-200'
        : 'bg-stone-100 dark:bg-zinc-700 dark:border-0'
    "
  >
    <slot />
  </div>
</template>
