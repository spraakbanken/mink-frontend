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
import useAlert from "@/alert/alert.composable";

const router = useRouter();
const resourceStore = useResourceStore();
const { ids, resources } = storeToRefs(resourceStore);
const { adminMode } = useAdmin();
const { showAlert } = useAlert();

const previewToggles = reactive<Record<string, boolean>>({});

watchImmediate(adminMode, () => {
  // adminMode is undefined initially. If it resolves to false, go to the normal Library view instead.
  if (adminMode.value) resourceStore.loadResourceIds().catch(showAlert);
  else if (adminMode.value === false) router.push("/library");
});

async function load(id: string) {
  await resourceStore.loadResource(id).catch(showAlert);
  previewToggles[id] = true;
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
        <PendingContent v-for="id of ids" :key="id" :on="`${id}/info`">
          <div class="flex items-baseline gap-2">
            <router-link :to="`/library/resource/${id}`">
              <header class="text-lg font-semibold font-mono">
                {{ id }}
              </header>
            </router-link>

            <ActionButton v-if="!(id in resources)" @click.stop="load(id)">
              {{ $t("load") }}
            </ActionButton>
            <ActionButton
              v-else-if="previewToggles[id]"
              @click.stop="previewToggles[id] = false"
            >
              {{ $t("expand.close") }}
            </ActionButton>
            <ActionButton v-else @click.stop="previewToggles[id] = true">
              {{ $t("expand.open") }}
            </ActionButton>

            <!-- Show a few selected details if loaded -->
            <div class="ml-4">
              <div v-if="id in resources" class="flex gap-4">
                <span>{{ resources[id].owner.name }}</span>
                <span
                  v-if="
                    isCorpus(resources[id]) &&
                    resources[id].job &&
                    Object.values(resources[id].job.status).includes('error')
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
            v-if="previewToggles[id] && id in resources"
            :id
            :resource="resources[id]"
          />
        </PendingContent>
      </PendingContent>
    </LayoutSection>
  </div>
</template>
