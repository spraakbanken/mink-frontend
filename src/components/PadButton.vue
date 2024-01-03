<template>
  <router-link
    :to="to"
    class="mink-button m-2 w-40 h-40 flex flex-col justify-center items-center text-center"
    :class="{ 'cursor-pointer': clickable }"
  >
    <slot />
  </router-link>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
});

const attrs = useAttrs();

const clickable = computed(() => !!attrs.onClick);
</script>
