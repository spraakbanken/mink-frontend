<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to: RouteLocationRaw;
  disabled?: boolean;
}>();
</script>

<template>
  <router-link v-slot="{ navigate }" :to="to" custom>
    <ActionButton :disabled="disabled" v-bind="$attrs" @click="navigate">
      <slot />
    </ActionButton>
  </router-link>
</template>
