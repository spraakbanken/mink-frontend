<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";

const id = useResourceIdParam();
</script>

<template>
  <ResourceViewTemplate type="corpus" :id />
</template>
