<script setup lang="ts">
import HeightResizable from "@/components/HeightResizable.vue";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";

defineProps<{
  text: string;
  language?: string;
}>();
</script>

<template>
  <HeightResizable>
    <SyntaxHighlight :code="text" :language />
  </HeightResizable>
</template>
