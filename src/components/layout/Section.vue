<template>
  <div class="my-4">
    <h2 v-if="title" class="text-xl uppercase">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
});
</script>

<style></style>
