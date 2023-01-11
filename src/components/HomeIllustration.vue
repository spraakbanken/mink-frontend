<script setup>
defineProps(["deg"]);
</script>

<template>
  <figure
    :class="[
      `${deg > 0 ? '' : '-'}rotate-${Math.abs(deg)}`,
      'shadow-lg',
      `hover:${deg > 0 ? '' : '-'}rotate-${Math.abs(deg) * 1.5}`,
      'hover:scale-110',
      'transition-transform',
    ]"
  >
    <slot />
  </figure>
</template>
