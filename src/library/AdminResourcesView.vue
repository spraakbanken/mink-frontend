<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { watchImmediate } from "@vueuse/core";
import { storeToRefs } from "pinia";
import AdminResourcePreview from "@/library/AdminResourcePreview.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useResourceStore } from "@/store/resource.store";
import { isCorpus } from "@/store/resource.types";
import useAdmin from "@/user/admin.composable";
import HelpBox from "@/components/HelpBox.vue";
import ActionButton from "@/components/ActionButton.vue";
import useMessenger from "@/message/messenger.composable";

const router = useRouter();
const resourceStore = useResourceStore();
const { resourceIds, resources } = storeToRefs(resourceStore);
const { adminMode } = useAdmin();
const { alertError } = useMessenger();

const previewToggles = reactive<Record<string, boolean>>({});

watchImmediate(adminMode, () => {
  // adminMode is undefined initially. If it resolves to false, go to the normal Library view instead.
  if (adminMode.value) resourceStore.loadResourceIds().catch(alertError);
  else if (adminMode.value === false) router.push("/library");
});

async function load(resourceId: string) {
  await resourceStore.loadResource(resourceId).catch(alertError);
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
      <PendingContent on="resources" class="my-4 flex flex-col gap-6">
        <PendingContent
          v-for="resourceId of resourceIds"
          :key="resourceId"
          :on="`${resourceId}/info`"
        >
          <div class="flex items-baseline gap-2">
            <router-link :to="`/library/resource/${resourceId}`">
              <header class="text-lg font-semibold font-mono">
                {{ resourceId }}
              </header>
            </router-link>

            <ActionButton
              v-if="!(resourceId in resources)"
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
              <div v-if="resourceId in resources" class="flex gap-4">
                <span>{{ resources[resourceId].owner.name }}</span>
                <span
                  v-if="
                    isCorpus(resources[resourceId]) &&
                    resources[resourceId].job &&
                    Object.values(resources[resourceId].job.status).includes(
                      'error',
                    )
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
            v-if="previewToggles[resourceId] && resourceId in resources"
            :resource-id="resourceId"
            :resource="resources[resourceId]"
          />
        </PendingContent>
      </PendingContent>
    </LayoutSection>
  </div>
</template>
