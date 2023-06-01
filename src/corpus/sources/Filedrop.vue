<template>
  <div :class="{ dragover: isDragover }">
    <slot />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import useMessenger from "@/message/messenger.composable";
import useDropToPage from "@/components/droptopage.composable";

const emit = defineEmits(["drop"]);

const { alert } = useMessenger();
const { t } = useI18n();

function drop(event) {
  // On Chrome+Ubuntu, the file list may be empty for security reasons.
  // See https://askubuntu.com/a/1411727
  if (!event.dataTransfer.files[0]) {
    alert(t("source.upload.drop.empty"), "error");
    return;
  }

  emit("drop", event.dataTransfer.files);
}

const { isDragover } = useDropToPage(drop);
</script>

<style scoped>
.dragover {
  @apply shadow-lg;
}
</style>
