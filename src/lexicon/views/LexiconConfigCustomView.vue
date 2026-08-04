<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ConfigCustomViewTemplate from "@/resource/ConfigCustomViewTemplate.vue";

const id = useResourceIdParam();
</script>

<template>
  <ConfigCustomViewTemplate type="lexicon" :id />
</template>
