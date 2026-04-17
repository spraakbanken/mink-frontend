<script setup lang="ts">
import { ref } from "vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";
import { useResourceStore } from "@/store/resource.store";
import { type Metadata } from "@/store/resource.types";

const id = useResourceIdParam();
const { loadTypedResource } = useResourceStore();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const metadata = ref<Metadata>();

loadTypedResource("metadata", id)
  .then((resource) => (metadata.value = resource))
  .catch(handle404)
  .catch(alertError);
</script>

<template>
  <template v-if="metadata">
    <PageTitle subtitle="metadata">
      <router-link
        :to="`/library/metadata/${id}`"
        class="text-inherit no-underline hover:underline"
      >
        {{ id }}
      </router-link>
    </PageTitle>

    <router-view />
  </template>
</template>
