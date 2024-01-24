<script setup lang="ts">
defineProps<{
  href: string;
  target?: string;
  disabled?: boolean;
}>();
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
