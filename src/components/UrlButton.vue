<script setup>
defineProps({
  href: { type: String, required: true },
  target: { type: String, default: undefined },
  disabled: Boolean,
});
</script>

<template>
  <a
    :href="disabled ? undefined : href"
    :target="target"
    class="inline-block mink-button"
    :class="{ disabled }"
  >
    <slot />
  </a>
</template>

<style scoped>
.mute {
  @apply text-inherit border-0 shadow-none;
}
.mute:not(:hover) {
  @apply bg-transparent text-inherit;
}

.slim {
  @apply p-0 px-1;
}
</style>
