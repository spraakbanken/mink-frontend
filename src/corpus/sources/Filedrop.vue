<template>
  <div :class="{ dragover: isDragover }">
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import useMessenger from "@/message/messenger.composable";
import { useToggle } from "@vueuse/core";

const emit = defineEmits(["drop"]);

const { alert } = useMessenger();
const { t } = useI18n();
const [isDragover, setDragover] = useToggle();

function drop(event) {
  event.preventDefault();

  // On Chrome+Ubuntu, the file list may be empty for security reasons.
  // See https://askubuntu.com/a/1411727
  if (!event.dataTransfer.files[0]) {
    alert(t("source.upload.drop.empty"), "error");
    return;
  }

  emit("drop", event.dataTransfer.files);
  setDragover(false);
}

const pageEl = document.querySelector("html");
function onDragover(event) {
  event.preventDefault();
  setDragover(true);
}
function onDragleave() {
  setDragover(false);
}
onMounted(() => {
  pageEl.addEventListener("dragover", onDragover);
  pageEl.addEventListener("dragleave", onDragleave);
  pageEl.addEventListener("drop", drop);
});
onUnmounted(() => {
  pageEl.removeEventListener("dragover", onDragover);
  pageEl.removeEventListener("dragleave", onDragleave);
  pageEl.removeEventListener("drop", drop);
});
</script>

<style scoped>
.dragover {
  @apply shadow-lg;
}
</style>
