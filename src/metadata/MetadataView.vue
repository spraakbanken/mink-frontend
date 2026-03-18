<script setup lang="ts">
import useMetadata from "@/metadata/metadata.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useMessenger from "@/message/messenger.composable";
import { computedAsync } from "@vueuse/core";
import useNotFound from "@/components/notfound.composable";

const resourceId = useResourceIdParam();
const { loadMetadata } = useMetadata(resourceId);
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const metadata = computedAsync(() =>
  loadMetadata().catch(handle404).catch(alertError),
);
</script>

<template>
  <template v-if="metadata">
    <PageTitle subtitle="metadata">
      <router-link
        :to="`/library/metadata/${resourceId}`"
        class="text-inherit no-underline hover:underline"
      >
        {{ resourceId }}
      </router-link>
    </PageTitle>

    <router-view />
  </template>
</template>
