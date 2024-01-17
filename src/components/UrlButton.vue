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
