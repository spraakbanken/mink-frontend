<script setup>
import ActionButton from "./ActionButton.vue";

defineProps({
  to: { type: [String, Object], required: true },
  disabled: Boolean,
});
</script>

<template>
  <router-link v-slot="{ navigate }" :to="to" custom>
    <ActionButton :disabled="disabled" v-bind="$attrs" @click="navigate">
      <slot />
    </ActionButton>
  </router-link>
</template>
