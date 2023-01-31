<script setup>
defineProps(["tag"]);
</script>

<template>
  <div class="flex items-baseline">
    <span class="text-sm bg-gray-200 dark:bg-zinc-500 p-1 mr-1">{{ tag }}</span>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
