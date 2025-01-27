<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <PhCaretDoubleDown />
  </ActionButton>
</template>
