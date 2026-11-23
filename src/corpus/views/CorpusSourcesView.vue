<script lang="ts" setup>
import { useCorpus } from "../corpus.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SourcesViewTemplate from "@/sources/SourcesViewTemplate.vue";

const id = useResourceIdParam();
const { updateSourceFormat } = useCorpus(id);
</script>

<template>
  <SourcesViewTemplate type="corpus" :id @upload="updateSourceFormat" />
</template>
