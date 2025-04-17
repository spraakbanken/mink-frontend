<script setup lang="ts">
import { useRouter } from "vue-router";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";

const router = useRouter();
const { requireAuthentication } = useAuth();
const resourceId = useResourceIdParam();
const resourceStore = useResourceStore();

requireAuthentication(async () => {
  // Load resource and immediately redirect according to its type.
  const resource = await resourceStore.loadResource(resourceId);
  if (!resource) return;
  router.push(`/library/${resource.type}/${resourceId}`);
});
</script>

<template>
  <div />
</template>
