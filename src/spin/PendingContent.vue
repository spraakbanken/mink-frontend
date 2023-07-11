<script setup>
import Spinner from "./Spinner.vue";
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
  <div class="relative" :class="{ 'animate-pulse2': pending.includes(on) }">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 z-30 flex justify-center items-center"
      :class="{ hidden: !pending.includes(on) }"
    >
      <Spinner />
    </div>
    <slot />
  </div>
</template>
