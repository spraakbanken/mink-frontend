<script lang="ts" setup>
import { useRoute } from "vue-router";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SourceViewTemplate from "@/sources/SourceViewTemplate.vue";

const route = useRoute();
const id = useResourceIdParam();

const filename = route.params.filename as string;
</script>

<template>
  <SourceViewTemplate type="lexicon" :id :filename />
</template>
