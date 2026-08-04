<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import DeleteViewTemplate from "@/resource/DeleteViewTemplate.vue";

const id = useResourceIdParam();
</script>

<template>
  <DeleteViewTemplate type="corpus" :id />
</template>
