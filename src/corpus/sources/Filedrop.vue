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

const emit = defineEmits(["drop"]);

const isDragover = ref(false);

function drop(event) {
  emit("drop", event.dataTransfer.files);
  isDragover.value = false;
}
</script>

<style scoped>
.dragover {
  @apply shadow-lg;
}
</style>
