<script setup lang="ts">
// Let attrs fall through to the img element.
defineOptions({
  inheritAttrs: false,
});

defineProps<{
  alt: string;
  /** An image with dark foreground to use in light mode. */
  src: string;
  /** An image with light foreground to use in dark mode. */
  srcLight: string;
}>();
</script>

<template>
  <!-- Wrap img with picture+source to select file depending on light/dark mode -->
  <picture>
    <source media="(prefers-color-scheme: dark)" :srcset="srcLight" />
    <img :src :alt v-bind="$attrs" />
  </picture>
</template>
