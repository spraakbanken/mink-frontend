<script setup>
import useSpin from "./spin.composable";

defineProps({
  on: {
    type: String,
    required: true,
  },
});
const { pending } = useSpin();
</script>

<template>
  <div :class="{ 'animate-pulse': pending.includes(on) }">
    <slot />
  </div>
</template>
