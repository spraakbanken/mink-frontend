<script setup lang="ts">
import { computed } from "vue";
import { PhTrash } from "@phosphor-icons/vue";
import useMetadata from "@/metadata/metadata.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import TextData from "@/components/TextData.vue";
import FileUpload from "@/components/FileUpload.vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();
const { uploadYaml } = useMetadata(resourceId);

const metadata = computed(() => resourceStore.metadatas[resourceId]);

async function uploadMetadata(files: File[]) {
  const yaml = await files[0]!.text();
  await uploadYaml(yaml);
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="flex-1">
      <LayoutBox title="metadata">
        <p>Public id: {{ metadata?.publicId }}</p>

        <RouteButton
          class="button-danger"
          :to="`/library/metadata/${resourceId}/delete`"
        >
          <PhTrash class="inline mb-1" />
          {{ $t("delete") }}
        </RouteButton>
      </LayoutBox>
    </div>

    <div class="flex-1">
      <PendingContent :on="`resource/${resourceId}/metadata`">
        <LayoutBox title="content" class="flex-1">
          <TextData
            v-if="metadata.metadata"
            :text="metadata.metadata"
          ></TextData>

          <FileUpload
            :file-handler="uploadMetadata"
            :primary="!metadata.metadata"
            accept=".yaml,.yml"
          />
        </LayoutBox>
      </PendingContent>
    </div>
  </div>
</template>
