<template>
  <button class="inline-block mink-button" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
defineProps({ disabled: Boolean });
</script>
