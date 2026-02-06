<script setup lang="ts">
import { ref } from "vue";
import type { AxiosProgressEvent } from "axios";
import FileDropArea from "@/components/FileDropArea.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import useMessenger from "@/message/messenger.composable";
import type { ProgressHandler } from "@/api/api.types";
import { handleFileInput } from "@/util";

const props = defineProps<{
  /**
   * A function that presumably uploads given file(s) to the appropriate API.
   */
  fileHandler: (files: File[], onProgress: ProgressHandler) => Promise<void>;
  primary?: boolean;
  accept?: string;
  multiple?: boolean;
  showProgress?: boolean;
}>();

const { clear } = useMessenger();
const progress = ref<number>();

/** Call upload function. */
async function handleUpload(files: File[]) {
  clear();
  try {
    await props.fileHandler(files, onProgress);
  } finally {
    progress.value = undefined;
  }
}

/** Report upload progress. */
function onProgress(progressEvent: AxiosProgressEvent) {
  progress.value = progressEvent.progress;
}
</script>

<template>
  <FileDropArea @drop="handleUpload">
    <label for="file-input" class="cursor-pointer">
      <div
        :class="
          primary
            ? [
                'bg-blue-50',
                'border-blue-100',
                'dark:bg-sky-900',
                'dark:border-sky-600',
                'dark:text-sky-200',
              ]
            : [
                'bg-zinc-100',
                'border-zinc-200',
                'dark:bg-zinc-700',
                'dark:border-zinc-500',
              ]
        "
        class="border-dashed border-4"
      >
        <span class="absolute uppercase opacity-70 text-sm font-semibold p-1">
          {{
            multiple ? $t("upload.label.multiple") : $t("upload.label.single")
          }}
        </span>
        <div class="p-8">
          <div
            class="flex flex-col justify-center items-center gap-2 opacity-70"
          >
            <div>
              {{
                multiple ? $t("upload.dnd.multiple") : $t("upload.dnd.single")
              }}
            </div>

            <input
              id="file-input"
              type="file"
              class="hidden"
              :multiple="multiple"
              :accept="accept"
              @change="handleFileInput($event, handleUpload)"
            />

            <ProgressBar
              v-if="showProgress && progress !== undefined"
              :percent="progress * 100"
              :running="false"
              class="w-60"
            />

            <slot />
          </div>
        </div>
      </div>
    </label>
  </FileDropArea>
</template>
