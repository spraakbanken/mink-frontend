<template>
  <div
    class="inline-block mink-button"
    :class="{ [variantClass]: true, 'cursor-pointer': clickable }"
  >
    <slot />
  </div>
</template>

<script setup>
import { useVariant, variantProps } from "@/composables/variant";
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

const props = defineProps({ ...variantProps });

const attrs = useAttrs();
const { variantClass } = useVariant(props.variant);

const clickable = computed(() => !!attrs.onClick);
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
