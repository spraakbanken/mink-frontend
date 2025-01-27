<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { getFilesFromDataTransferItems } from "datatransfer-files-promise";
import useMessenger from "@/message/messenger.composable";
import useDropToPage from "@/components/droptopage.composable";

const emit = defineEmits<{
  (e: "drop", files: File[]): void;
}>();

const { alert } = useMessenger();
const { t } = useI18n();

async function drop(event: DragEvent) {
  // On Chrome+Ubuntu, the file list may be empty for security reasons.
  // See https://askubuntu.com/a/1411727
  if (!event.dataTransfer?.files[0]) {
    alert(t("upload.drop.empty"), "error");
    return;
  }

  // In contrast to `event.dataTransfer.files`, this traverses directories.
  const items: DataTransferItemList = event.dataTransfer.items;
  const files: File[] = await getFilesFromDataTransferItems(items);

  // Skip hidden files like .DS_Store
  const filesAllowed = files.filter((file: File) => file.name[0] != ".");

  emit("drop", filesAllowed);
}

const { isDragover } = useDropToPage(drop);
</script>

<template>
  <div :class="{ 'shadow-lg': isDragover }">
    <slot />
  </div>
</template>
