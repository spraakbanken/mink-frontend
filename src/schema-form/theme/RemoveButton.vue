<script setup lang="ts">
import { PhTrash } from "@phosphor-icons/vue";
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <PhTrash />
  </ActionButton>
</template>
