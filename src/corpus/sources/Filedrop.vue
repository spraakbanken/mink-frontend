<template>
  <div
    :class="{ dragover: isDragover }"
    @drop.prevent="drop"
    @dragover.prevent="isDragover = true"
    @dragleave.prevent="isDragover = false"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { getFilesFromDataTransferItems } from "datatransfer-files-promise";

const emit = defineEmits(["drop"]);

const isDragover = ref(false);

async function drop(event) {
  const files = await getFilesFromDataTransferItems(event.dataTransfer.items);
  emit("drop", files);
  isDragover.value = false;
}
</script>

<style scoped>
.dragover {
  @apply shadow-lg;
}
</style>
