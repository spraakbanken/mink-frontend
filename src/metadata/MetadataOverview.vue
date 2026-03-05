<script setup lang="ts">
import { computed } from "vue";
import { PhLock, PhTrash } from "@phosphor-icons/vue";
import useMetadata from "@/metadata/metadata.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import TextData from "@/components/TextData.vue";
import FileUpload from "@/components/FileUpload.vue";
import SharingPanel from "@/auth/SharingPanel.vue";
import { useAuth } from "@/auth/auth.composable";
import HelpBox from "@/components/HelpBox.vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();
const { uploadYaml } = useMetadata(resourceId);
const { canAdmin, canWrite } = useAuth();

const metadata = computed(() => resourceStore.metadatas[resourceId]);

async function uploadMetadata(files: File[]) {
  const yaml = await files[0]!.text();
  await uploadYaml(yaml);
}
</script>

<template>
  <div v-if="metadata" class="flex flex-wrap gap-4">
    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox title="metadata">
        <p>Public id: {{ metadata.publicId }}</p>

        <RouteButton
          :disabled="!canAdmin('corpora', resourceId)"
          class="button-danger"
          :to="`/library/metadata/${resourceId}/delete`"
        >
          <PhTrash class="inline mb-1 mr-1" />
          {{ $t("delete") }}
        </RouteButton>
      </LayoutBox>

      <LayoutBox :title="$t('sharing')">
        <SharingPanel resourceType="corpora" :resource-id />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <PendingContent :on="`resource/${resourceId}/metadata`">
        <LayoutBox title="content" class="flex-1">
          <TextData
            v-if="metadata.metadata"
            :text="metadata.metadata"
          ></TextData>

          <FileUpload
            v-if="canWrite('corpora', resourceId)"
            :file-handler="uploadMetadata"
            :primary="!metadata.metadata"
            accept=".yaml,.yml"
          />
          <HelpBox v-else>
            <PhLock class="inline mb-0.5 mr-1" />
            {{ $t("resource.access_denied") }}
          </HelpBox>
        </LayoutBox>
      </PendingContent>
    </div>
  </div>
</template>
