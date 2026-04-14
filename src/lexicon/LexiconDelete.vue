<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhTrash } from "@phosphor-icons/vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import useDeleteResource from "@/resource/deleteResource.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";

const router = useRouter();
const id = useResourceIdParam();
const { deleteResource } = useDeleteResource();
const { canAdmin } = useAuth();
const { alertError } = useMessenger();

async function doDelete() {
  try {
    await deleteResource("lexicon", id);
    router.push("/library");
  } catch (error) {
    alertError(error);
  }
}
</script>

<template>
  <PendingContent :on="`${id}`" blocking>
    <LayoutSection :title="$t('lexicon.delete')">
      <p class="my-2">{{ $t("resource.delete.ask") }}</p>

      <div>
        <ActionButton
          :disabled="!canAdmin('lexica', id)"
          class="button-danger mr-4"
          @click="doDelete"
        >
          <PhTrash weight="fill" class="inline mb-1 mr-1" />
          {{ $t("lexicon.delete") }}
        </ActionButton>

        <RouteButton :to="`/library/lexicon/${id}`">
          {{ $t("cancel") }}
        </RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
