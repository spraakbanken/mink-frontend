<script setup lang="ts">
import ExportViewTemplate from "@/exports/ExportViewTemplate.vue";

defineProps<{
  id: string;
  path: string;
}>();
</script>

<template>
  <ExportViewTemplate type="lexicon" :id :path />
</template>
