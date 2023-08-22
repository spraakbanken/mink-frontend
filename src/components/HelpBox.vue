<script setup>
defineProps({
  important: {
    type: Boolean,
  },
});
</script>

<template>
  <div
    class="my-2 rounded p-2 px-4 max-w-screen-sm"
    :class="
      important
        ? 'bg-blue-100 border-2 border-blue-300 dark:bg-sky-200 dark:border-0 dark:text-sky-800'
        : 'bg-stone-100 dark:bg-zinc-700 dark:border-0'
    "
  >
    <slot />
  </div>
</template>
