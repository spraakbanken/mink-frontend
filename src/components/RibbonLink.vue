<template>
  <router-link
    v-if="isLink && !disabled"
    :to="to"
    class="flex-1 mink-button text-sm text-current hover:bg-gray-50"
  >
    <slot />
  </router-link>
  <div
    v-else
    class="flex-1 text-sm p-1 px-2 rounded"
    :class="isCurrent ? 'bg-gray-200' : ''"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps(["to", "disabled"]);

const isLink = computed(
  () => props.to && router.resolve(props.to)?.path != route.path
);
const isCurrent = computed(
  () => props.to && router.resolve(props.to)?.path == route.path
);
</script>

<style></style>
