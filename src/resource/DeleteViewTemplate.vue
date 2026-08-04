<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhTrash } from "@phosphor-icons/vue";
import useDeleteResource from "@/resource/deleteResource.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useUserStore } from "@/store/user.store";
import useMessenger from "@/alert/alert.composable";
import type { ResourceType } from "@/api/api.types";

const props = defineProps<{
  type: ResourceType;
  id: string;
}>();

const router = useRouter();
const { deleteResource } = useDeleteResource();
const { canAdmin } = useUserStore();
const { showAlert } = useMessenger();

async function doDelete() {
  try {
    await deleteResource(props.type, props.id);
    router.push("/library");
  } catch (error) {
    showAlert(error);
  }
}
</script>

<template>
  <PendingContent :on="`${id}`" blocking>
    <LayoutSection :title="$t('delete')">
      <p class="my-2">{{ $t("resource.delete.ask") }}</p>

      <div>
        <ActionButton
          :disabled="!canAdmin(type, id)"
          class="button-danger mr-4"
          @click="doDelete"
        >
          <PhTrash weight="fill" class="inline mb-1 mr-1" />
          {{ $t("delete") }}
        </ActionButton>

        <RouteButton :to="`/library/resource/${id}`">
          {{ $t("cancel") }}
        </RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
