<script setup lang="ts">
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceConfigCustom from "@/resource/ResourceConfigCustom.vue";

const id = useResourceIdParam();
</script>

<template>
  <ResourceConfigCustom type="lexicon" :id />
</template>
