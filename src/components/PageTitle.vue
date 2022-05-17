<template>
  <header class="flex items-end mt-2 mb-4">
    <h1>
      <slot />
    </h1>
    <h2 v-if="subtitle" class="ml-8 text-gray-600">
      {{ $t(subtitle) }}
    </h2>
  </header>
</template>

<script setup>
const props = defineProps({
  subtitle: String,
});
</script>

<style></style>
