<script setup lang="ts">
import { PhLock, PhTrash } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
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
import useMessenger from "@/message/messenger.composable";
import { useConfigStore } from "@/store/config.store";

const id = useResourceIdParam();
const { loadResource } = useResourceStore();
const { loadConfig, uploadConfig } = useConfigStore();
const { canAdmin, canWrite } = useAuth();
const { alertError } = useMessenger();

const metadata = computedAsync(() => loadResource(id));
const config = computedAsync(() => loadConfig("metadata", id));

async function uploadMetadata(files: File[]) {
  const yaml = await files[0]!.text();
  await uploadConfig("metadata", id, yaml).catch(alertError);
}
</script>

<template>
  <div v-if="metadata" class="flex flex-wrap gap-4">
    <div class="w-96 grow flex flex-col gap-4">
      <LayoutBox title="metadata">
        <p>Public id: {{ metadata.publicId }}</p>

        <RouteButton
          :disabled="!canAdmin('metadata', id)"
          class="button-danger"
          :to="`/library/metadata/${id}/delete`"
        >
          <PhTrash class="inline mb-1 mr-1" />
          {{ $t("delete") }}
        </RouteButton>
      </LayoutBox>

      <LayoutBox :title="$t('sharing')">
        <SharingPanel resource-type="metadata" :id />
      </LayoutBox>
    </div>

    <div class="w-96 grow flex flex-col gap-4">
      <PendingContent :on="`resource/${id}/metadata`">
        <LayoutBox title="content" class="flex-1">
          <TextData v-if="config" :text="config"></TextData>

          <FileUpload
            v-if="canWrite('metadata', id)"
            :file-handler="uploadMetadata"
            :primary="!config"
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
