<script setup lang="ts">
import { computed } from "vue";
import { useResourceStore } from "@/store/resource.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import TextData from "@/components/TextData.vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();

const metadata = computed(() => resourceStore.metadatas[resourceId]);
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
          <icon :icon="['far', 'trash-can']" class="mr-1" />
          {{ $t("delete") }}
        </RouteButton>
      </LayoutBox>
    </div>

    <div class="flex-1">
      <LayoutBox title="content" class="flex-1">
        <TextData v-if="metadata.metadata" :text="metadata.metadata"></TextData>
      </LayoutBox>
    </div>
  </div>
</template>
