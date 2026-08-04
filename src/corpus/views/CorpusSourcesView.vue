<script lang="ts" setup>
import { useCorpus } from "../corpus.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SourcesPanel from "@/sources/SourcesPanel.vue";

const id = useResourceIdParam();
const { updateSourceFormat } = useCorpus(id);
</script>

<template>
  <!-- TODO Rename to SourcesViewTemplate -->
  <SourcesPanel type="corpus" :id @upload="updateSourceFormat" />
</template>
