<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useResourceStore } from "@/store/resource.store";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();

const resource = resourceStore.metadatas[resourceId];
</script>

<template>Public id: {{ resource.publicId }}</template>
