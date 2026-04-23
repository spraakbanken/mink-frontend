<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhTrash } from "@phosphor-icons/vue";
import useDeleteResource from "@/resource/deleteResource.composable";
import useMetadataIdParam from "@/resource/resourceIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";
import { useAuth } from "@/auth/auth.composable";

const router = useRouter();
const id = useMetadataIdParam();
const { deleteResource } = useDeleteResource();
const resourceStore = useResourceStore();
const { canAdmin } = useAuth();

async function doDelete() {
  await deleteResource("metadata", id);
  if (!resourceStore.ids.includes(id)) {
    router.push("/library");
  }
}
</script>

<template>
  <PendingContent :on="`resource/${id}`" blocking>
    <LayoutSection :title="$t('metadata.delete')">
      <p class="my-2">{{ $t("resource.delete.ask") }}</p>

      <div>
        <ActionButton
          :disabled="!canAdmin('metadata', id)"
          class="button-danger mr-4"
          @click="doDelete"
        >
          <PhTrash class="inline mb-1 mr-1" />
          {{ $t("metadata.delete") }}
        </ActionButton>

        <RouteButton :to="`/library/metadata/${id}`">{{
          $t("cancel")
        }}</RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
