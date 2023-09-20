<template>
  <router-link
    :to="to"
    class="mink-button m-2 w-40 h-40 flex flex-col justify-center items-center text-center"
    :class="{ [variantClass]: true, 'cursor-pointer': clickable }"
  >
    <slot />
  </router-link>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";
import { useVariant, variantProps } from "@/variant.composable";

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  ...variantProps,
});

const attrs = useAttrs();
const { variantClass } = useVariant(() => props.variant);

const clickable = computed(() => !!attrs.onClick);
</script>
