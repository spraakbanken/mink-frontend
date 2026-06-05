<script setup lang="ts">
import { useSparv } from "../sparv.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ExportListViewTemplate from "@/exports/ExportListViewTemplate.vue";

const id = useResourceIdParam();
const { exportTypes } = useSparv();
</script>

<template>
  <ExportListViewTemplate type="corpus" :id :exportTypes />
</template>
