<script setup>
defineProps({
  tilt: {
    type: String,
    default: () => "none",
    validate: (tilt) => ["none", "left", "right"].includes(tilt),
  },
});
</script>

<template>
  <figure
    :class="[
      { left: '-rotate-2', right: 'rotate-2' }[tilt],
      'shadow-lg',
      { left: 'hover:-rotate-3', right: 'hover:rotate-3' }[tilt],
      'hover:scale-110',
      'transition-transform',
    ]"
  >
    <slot />
  </figure>
</template>
