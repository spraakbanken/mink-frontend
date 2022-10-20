<template>
  <div
    class="inline-block mink-button"
    :class="{ [variantClass]: true, disabled }"
  >
    <slot />
  </div>
</template>

<script setup>
import { useVariant, variantProps } from "@/composables/variant";

const props = defineProps({ ...variantProps, disabled: Boolean });

const { variantClass } = useVariant(props.variant);
</script>

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
