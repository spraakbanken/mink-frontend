<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import AdminResourcePreview from "@/library/AdminResourcePreview.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useResourceStore } from "@/store/resource.store";
import { isCorpus } from "@/store/resource.types";
import useAdmin from "@/user/admin.composable";
import HelpBox from "@/components/HelpBox.vue";
import ActionButton from "@/components/ActionButton.vue";

const router = useRouter();
const resourceStore = useResourceStore();
const { adminMode } = useAdmin();

const previewToggles = reactive<Record<string, boolean>>({});

watch(adminMode, () => {
  // adminMode is undefined initially. If it resolves to false, go to the normal Library view instead.
  if (adminMode.value === false) {
    return router.push("/library");
  } else {
    resourceStore.loadResourceIds();
  }
});

async function load(resourceId: string) {
  await resourceStore.loadResource(resourceId);
  previewToggles[resourceId] = true;
}
</script>

<template>
  <div v-if="adminMode">
    <PageTitle subtitle="admin.page.subtitle">{{ $t("resources") }}</PageTitle>

    <HelpBox>
      {{ $t("admin.resources.help") }}
    </HelpBox>

    <LayoutSection>
      <PendingContent on="corpora" class="my-4 flex flex-col gap-6">
        <PendingContent
          v-for="(resource, resourceId) of resourceStore.resources"
          :key="resourceId"
          :on="`corpus/${resourceId}/info`"
        >
          <div class="flex items-baseline gap-2">
            <router-link :to="`/library/resource/${resourceId}`">
              <header class="text-lg font-semibold font-mono">
                {{ resourceId }}
              </header>
            </router-link>

            <ActionButton
              v-if="!('type' in resource)"
              @click.stop="load(resourceId)"
            >
              {{ $t("load") }}
            </ActionButton>
            <ActionButton
              v-else-if="previewToggles[resourceId]"
              @click.stop="previewToggles[resourceId] = false"
            >
              {{ $t("expand.close") }}
            </ActionButton>
            <ActionButton
              v-else
              @click.stop="previewToggles[resourceId] = true"
            >
              {{ $t("expand.open") }}
            </ActionButton>

            <!-- Show a few selected details if loaded -->
            <div class="ml-4">
              <div v-if="'type' in resource" class="flex gap-4">
                <span>{{ resource.owner.name }}</span>
                <span
                  v-if="
                    isCorpus(resource) &&
                    resource.job &&
                    Object.values(resource.job.status).includes('error')
                  "
                >
                  {{ $t("job.status.error") }}
                </span>
              </div>
              <div v-else class="italic opacity-75">
                {{ $t("not_loaded") }}
              </div>
            </div>
          </div>

          <AdminResourcePreview
            v-if="previewToggles[resourceId] && 'type' in resource"
            :resource-id="resourceId"
            :resource="resource"
          />
        </PendingContent>
      </PendingContent>
    </LayoutSection>
  </div>
</template>
