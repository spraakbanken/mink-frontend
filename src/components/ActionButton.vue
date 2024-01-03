<template>
  <div class="inline-block mink-button" :class="{ disabled }">
    <slot />
  </div>
</template>

<script setup>
defineProps({ disabled: Boolean });
</script>
