<script setup lang="ts">
import { computed } from "vue";
import useMetadata from "@/metadata/metadata.composable";
import { useResourceStore } from "@/store/resource.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();
const { loadMetadata } = useMetadata(resourceId);

const metadata = computed(() => resourceStore.resources[resourceId]);

loadMetadata();
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
