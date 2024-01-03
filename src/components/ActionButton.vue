<template>
  <div class="inline-block mink-button" :class="{ disabled }">
    <slot />
  </div>
</template>

<script setup>
defineProps({ disabled: Boolean });
</script>

<style scoped>
.mute {
  @apply text-inherit border-0 shadow-none;
}
.mute:not(:hover) {
  @apply !bg-transparent !text-inherit;
}

.slim {
  @apply p-0 px-1;
}
</style>
