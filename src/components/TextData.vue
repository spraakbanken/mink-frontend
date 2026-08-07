<script setup lang="ts">
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";

defineProps<{
  text: string;
  language?: string;
}>();
</script>

<template>
  <SyntaxHighlight :code="text" :language />
</template>
