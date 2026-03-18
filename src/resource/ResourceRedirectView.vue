<script setup lang="ts">
import { useRouter } from "vue-router";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useResourceStore } from "@/store/resource.store";
import SpinIndicator from "@/spin/SpinIndicator.vue";
import useMessenger from "@/message/messenger.composable";

const router = useRouter();
const resourceId = useResourceIdParam();
const resourceStore = useResourceStore();
const { alertError } = useMessenger();

// Load resource and immediately redirect according to its type.
resourceStore
  .loadResource(resourceId)
  .then((resource) => {
    if (resource) router.push(`/library/${resource.type}/${resourceId}`);
    else router.push("/library");
  })
  .catch(alertError);
</script>

<template>
  <SpinIndicator />
</template>
