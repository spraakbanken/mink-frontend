<script setup>
defineProps(["tag"]);
</script>

<template>
  <div class="mb-1 last:mb-0">
    <span class="text-sm bg-gray-200 p-1 mr-1">{{ tag }}</span>
    <slot />
  </div>
</template>
