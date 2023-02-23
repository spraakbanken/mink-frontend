<template>
  <div class="mt-8 mb-4">
    <h2 v-if="title" class="text-2xl uppercase">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
});
</script>

<style></style>
