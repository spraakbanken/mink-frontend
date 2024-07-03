<script setup lang="ts">
import ActionButton from "@/components/ActionButton.vue";

defineProps<{
  disabled?: boolean;
  onClick: () => {};
}>();
</script>

<template>
  <!-- eslint-disable -->
  <ActionButton :disabled @click="onClick">+</ActionButton>
</template>
