<script setup lang="ts">
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import AdminResourcePreview from "@/library/AdminResourcePreview.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";
import { isCorpus } from "@/store/resource.types";
import ActionButton from "@/components/ActionButton.vue";
import useAlert from "@/alert/alert.composable";
import LayoutBox from "@/components/LayoutBox.vue";

const resourceStore = useResourceStore();
const { ids, resources } = storeToRefs(resourceStore);
const { showAlert } = useAlert();

const previewToggles = reactive<Record<string, boolean>>({});

async function load(id: string) {
  await resourceStore.loadResource(id).catch(showAlert);
  previewToggles[id] = true;
}
</script>

<template>
  <LayoutBox :title="$t('resources')">
    <PendingContent on="resources" class="my-4 flex flex-col gap-6">
      <PendingContent v-for="id of ids" :key="id" :on="`${id}/info`">
        <div class="flex items-baseline gap-2">
          <router-link :to="`/library/resource/${id}`">
            <h3 class="font-semibold font-mono">
              {{ id }}
            </h3>
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
  </LayoutBox>
</template>
