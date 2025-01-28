<script setup lang="ts">
import { PhCaretDoubleUp } from "@phosphor-icons/vue";
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <PhCaretDoubleUp />
  </ActionButton>
</template>
