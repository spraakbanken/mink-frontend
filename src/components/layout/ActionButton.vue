<template>
  <div
    class="inline-block minsb-button"
    :class="{ 'cursor-pointer': clickable }"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

const attrs = useAttrs();

const clickable = computed(() => !!attrs.onClick);
</script>

<style scoped>
.mute {
  @apply border-0 bg-transparent shadow-none;
}
.mute:not(:hover) {
  @apply bg-transparent;
}

.slim {
  @apply p-0 px-1;
}
</style>
