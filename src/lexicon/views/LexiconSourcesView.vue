<script lang="ts" setup>
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SourcesViewTemplate from "@/sources/SourcesViewTemplate.vue";

const id = useResourceIdParam();
</script>

<template>
  <SourcesViewTemplate type="lexicon" :id />
</template>
