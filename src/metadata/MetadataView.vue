<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";
import { useResourceStore } from "@/store/resource.store";

const id = useResourceIdParam();
const { loadResource } = useResourceStore();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const metadata = computedAsync(() =>
  loadResource(id).catch(handle404).catch(alertError),
);
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
