<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useResourceStore } from "@/store/resource.store";
import { computed } from "vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();

const resource = computed(() => resourceStore.metadatas[resourceId]);
</script>

<template>Public id: {{ resource?.publicId }}</template>
