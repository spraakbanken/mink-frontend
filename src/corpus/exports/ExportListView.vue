<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ExportListViewTemplate from "@/exports/ExportListViewTemplate.vue";
import type { ExportType } from "@/api/api.types";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";

const id = useResourceIdParam();
const { spin } = useSpin();

/** Sparv export type info */
const exportTypes = computedAsync<ExportType[]>(
  () => spin(api.sparvExports(), `${id}/exports/list`),
  [],
);
</script>

<template>
  <ExportListViewTemplate type="corpus" :id :exportTypes />
</template>
