<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ExportViewTemplate from "@/exports/ExportViewTemplate.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const route = useRoute();
const id = useResourceIdParam();

/** The export file path as read from the 'path' query param */
const path = computed(() => String(route.query["path"]));
</script>

<template>
  <ExportViewTemplate type="lexicon" :id :path />
</template>
