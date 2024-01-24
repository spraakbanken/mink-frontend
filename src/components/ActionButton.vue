<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <button class="inline-block mink-button" :disabled="disabled">
    <slot />
  </button>
</template>
