<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <button class="inline-block mink-button whitespace-nowrap" :disabled>
    <slot />
  </button>
</template>
