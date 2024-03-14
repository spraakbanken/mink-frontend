<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useResources from "./resources.composable";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import { useResourceStore } from "@/store/resource.store";
import useAdmin from "@/user/admin.composable";
import RouteButton from "@/components/RouteButton.vue";

const router = useRouter();
const resourceStore = useResourceStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const { adminMode } = useAdmin();
const { loadResourceIds } = useResources();

requireAuthentication();

watch(adminMode, () => {
  // adminMode is undefined initially. If it resolves to false, go to the normal Library view instead.
  if (adminMode.value === false) {
    return router.push("/library");
  } else {
    loadResourceIds();
  }
});
</script>

<template>
  <div v-if="adminMode">
    <PageTitle subtitle="admin.page.subtitle">{{ $t("resources") }}</PageTitle>
    <LayoutSection v-if="isAuthenticated">
      <PendingContent on="corpora" class="my-4 flex flex-col gap-3">
        <RouteButton
          v-for="(resource, resourceId) of resourceStore.resources"
          :key="resourceId"
          :to="`/library/resource/${resourceId}`"
          class="flex items-baseline gap-2"
        >
          <header class="text-lg font-bold font-mono">
            {{ resourceId }}
          </header>
        </RouteButton>
      </PendingContent>
    </LayoutSection>
  </div>
</template>
