<script setup lang="ts">
import { useRouter } from "vue-router";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import useResources from "@/library/resources.composable";
import SpinIndicator from "@/spin/SpinIndicator.vue";

const router = useRouter();
const resourceId = useResourceIdParam();
const { loadResource } = useResources();

// Load resource and immediately redirect according to its type.
loadResource(resourceId).then((resource) => {
  if (resource) router.push(`/library/${resource.type}/${resourceId}`);
  else router.push("/library");
});
</script>

<template>
  <SpinIndicator />
</template>
