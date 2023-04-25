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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import useMessenger from "@/message/messenger.composable";

const emit = defineEmits(["drop"]);

const { alert } = useMessenger();
const { t } = useI18n();

const isDragover = ref(false);

function drop(event) {
  // On Chrome+Ubuntu, the file list may be empty for security reasons.
  // See https://askubuntu.com/a/1411727
  if (!event.dataTransfer.files[0]) {
    alert(t("source.upload.drop.empty"), "error");
    return;
  }

  emit("drop", event.dataTransfer.files);
  isDragover.value = false;
}
</script>

<style scoped>
.dragover {
  @apply shadow-lg;
}
</style>
