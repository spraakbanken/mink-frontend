<script setup lang="ts">
import { PhPlus } from "@phosphor-icons/vue";
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <PhPlus />
  </ActionButton>
</template>
