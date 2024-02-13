<script setup lang="ts">
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { useResourceStore } from "@/store/resource.store";
import { computed } from "vue";

const resourceStore = useResourceStore();
const resourceId = useResourceIdParam();

const resource = computed(() => resourceStore.metadatas[resourceId]);
</script>

<template>
  <LayoutBox title="metadata">
    <p>Public id: {{ resource?.publicId }}</p>
    <RouteButton
      class="button-danger"
      :to="`/library/metadata/${resourceId}/delete`"
    >
      <icon :icon="['far', 'trash-can']" class="mr-1" />
      {{ $t("delete") }}
    </RouteButton>
  </LayoutBox>
</template>
