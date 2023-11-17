<template>
  <Filedrop @drop="handleUpload">
    <slot />
    <label for="file-input" class="cursor-pointer">
      <div
        :class="
          variant == 'primary'
            ? [
                'bg-blue-50',
                'border-blue-100',
                'dark:bg-blue-200',
                'dark:border-blue-300',
                'dark:text-blue-800',
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
        <span class="absolute uppercase opacity-70 text-sm font-bold p-1">
          {{ $t("source.upload") }}
        </span>
        <div class="p-8">
          <div
            class="flex flex-col justify-center items-center gap-2 opacity-70"
          >
            <div>{{ $t("source.upload.dnd") }}</div>

            <input
              id="file-input"
              type="file"
              class="hidden"
              multiple
              :accept="extensionsAccept"
              @change="handleFileInput"
            />

            <UploadSizeLimits />
          </div>
        </div>
      </div>
    </label>
  </Filedrop>
</template>

<script setup>
import { computed } from "vue";
import { getFilenameExtension } from "@/util";
import useMessenger from "@/message/messenger.composable";
import useSources from "./sources.composable";
import Filedrop from "./Filedrop.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import UploadSizeLimits from "./UploadSizeLimits.vue";
import useConfig from "../config/config.composable";

const props = defineProps({
  fileHandler: {
    type: Function,
    default: null,
  },
  variant: {
    type: String,
    default: null,
  },
});

const corpusId = useCorpusIdParam();
const { uploadSources, extensions } = useSources(corpusId);
const { config, uploadConfig } = useConfig(corpusId);
const { alertError, clear } = useMessenger();
const extensionsAccept = computed(() =>
  extensions.value?.map((ext) => `.${ext}`).join()
);

async function defaultFileHandler(files) {
  const requests = [uploadSources(files).catch(alertError)];

  // Also update format setting in config if needed
  const format = getFilenameExtension(files[0]?.name);
  if (format != config.value.format) {
    requests.push(uploadConfig({ ...config.value, format }));
  }

  await Promise.all(requests);
}
const fileHandler = props.fileHandler || defaultFileHandler;

async function handleFileInput(event) {
  await handleUpload(event.target.files);
  event.target.value = null;
}

async function handleUpload(files) {
  clear();
  await fileHandler(files);
}
</script>

<style></style>
