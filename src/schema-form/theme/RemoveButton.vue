<script setup lang="ts">
import ActionButton from "@/components/ActionButton.vue";
</script>

<template>
  <ActionButton v-bind="$props">
    <icon :icon="['far', 'trash-can']" />
  </ActionButton>
</template>
