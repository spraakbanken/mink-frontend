<template>
  <div class="my-4">
    <h2 v-if="props.title" class="text-xl uppercase">{{ props.title }}</h2>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
});
</script>

<style>
</style>
