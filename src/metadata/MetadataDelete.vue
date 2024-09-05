<script setup lang="ts">
import { useRouter } from "vue-router";
import useDeleteMetadata from "@/metadata/deleteMetadata.composable";
import useMetadataIdParam from "@/resource/resourceIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";

const router = useRouter();
const resourceId = useMetadataIdParam();
const { deleteMetadata } = useDeleteMetadata();
const resourceStore = useResourceStore();

async function doDelete() {
  await deleteMetadata(resourceId);
  if (!(resourceId in resourceStore.resources)) {
    router.push("/library");
  }
}
</script>

<template>
  <PendingContent :on="`resource/${resourceId}`" blocking>
    <LayoutSection :title="$t('metadata.delete')">
      <p class="my-2">{{ $t("resource.delete.ask") }}</p>

      <div>
        <ActionButton class="button-danger mr-4" @click="doDelete">
          <icon :icon="['far', 'trash-can']" />
          {{ $t("metadata.delete") }}
        </ActionButton>

        <RouteButton :to="`/library/metadata/${resourceId}`">{{
          $t("cancel")
        }}</RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
