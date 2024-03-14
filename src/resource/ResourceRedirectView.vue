<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/auth/auth.composable";
import useResourceIdParam from "./resourceIdParam.composable";
import useResources from "@/library/resources.composable";

const router = useRouter();
const { requireAuthentication } = useAuth();
const resourceId = useResourceIdParam();
const { loadResource } = useResources();

requireAuthentication(async () => {
  // Load resource and immediately redirect according to its type.
  const resource = await loadResource(resourceId);
  if (!resource) return;
  router.push(`/library/${resource.type}/${resourceId}`);
});
</script>

<template>
  <div />
</template>
