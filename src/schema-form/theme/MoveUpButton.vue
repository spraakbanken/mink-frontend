<script setup lang="ts">
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <icon :icon="['fas', 'angles-up']" />
  </ActionButton>
</template>
