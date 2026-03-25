<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import ActionButton from "@/components/ActionButton.vue";

defineProps<{
  to: RouteLocationRaw;
  disabled?: boolean;
}>();
</script>

<template>
  <router-link v-slot="{ navigate }" :to custom>
    <ActionButton :disabled v-bind="$attrs" @click="navigate">
      <slot />
    </ActionButton>
  </router-link>
</template>
