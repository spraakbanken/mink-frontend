<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    :disabled
    class="inline-block mink-button whitespace-nowrap"
  >
    <slot />
  </button>
</template>
