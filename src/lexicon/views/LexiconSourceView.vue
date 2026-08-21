<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SourceViewTemplate from "@/sources/SourceViewTemplate.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const route = useRoute();
const id = useResourceIdParam();

/** The source path as read from the 'path' query param */
const filename = computed(() => String(route.query["path"]));
</script>

<template>
  <SourceViewTemplate type="lexicon" :id :filename />
</template>
