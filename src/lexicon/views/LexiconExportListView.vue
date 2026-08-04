<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ExportListViewTemplate from "@/exports/ExportListViewTemplate.vue";

const id = useResourceIdParam();
</script>

<template>
  <ExportListViewTemplate type="lexicon" :id />
</template>
