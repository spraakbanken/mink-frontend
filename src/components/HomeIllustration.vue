<script setup>
defineProps({
  tilt: {
    type: String,
    default: () => "right",
  },
});
</script>

<template>
  <figure
    :class="[
      tilt == 'left' ? '-rotate-2' : 'rotate-2',
      'shadow-lg',
      tilt == 'left' ? 'hover:-rotate-3' : 'hover:rotate-3',
      'hover:scale-110',
      'transition-transform',
    ]"
  >
    <slot />
  </figure>
</template>
