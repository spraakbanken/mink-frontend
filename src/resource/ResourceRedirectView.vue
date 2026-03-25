<script setup lang="ts">
import { useRouter } from "vue-router";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useResourceStore } from "@/store/resource.store";
import SpinIndicator from "@/spin/SpinIndicator.vue";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";

const router = useRouter();
const id = useResourceIdParam();
const resourceStore = useResourceStore();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

// Load resource and immediately redirect according to its type.
resourceStore
  .loadResource(id)
  .then((resource) => {
    if (resource) router.push(`/library/${resource.type}/${id}`);
    else router.push("/library");
  })
  .catch(handle404)
  .catch(alertError);
</script>

<template>
  <SpinIndicator />
</template>
