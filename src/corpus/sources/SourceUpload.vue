<script setup lang="ts">
import { computed } from "vue";
import { getFilenameExtension } from "@/util";
import useMessenger from "@/message/messenger.composable";
import useSources from "./sources.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import UploadSizeLimits from "./UploadSizeLimits.vue";
import useConfig from "../config/config.composable";
import type { FileFormat } from "@/api/corpusConfig";
import FileUpload from "@/components/FileUpload.vue";
import type { ProgressHandler } from "@/api/api.types";

const props = defineProps<{
  fileHandler?: (files: FileList) => Promise<void>;
  primary?: boolean;
}>();

const corpusId = useCorpusIdParam();
const { uploadSources, extensions } = useSources(corpusId);
const { config, uploadConfig } = useConfig(corpusId);
const { alertError } = useMessenger();

const extensionsAccept = computed(() =>
  extensions.value?.map((ext) => `.${ext}`).join(),
);

async function defaultFileHandler(
  files: FileList,
  onProgress: ProgressHandler,
) {
  const requests = [uploadSources(files, onProgress).catch(alertError)];

  // Also update format setting in config if needed
  const format = getFilenameExtension(files[0]?.name) as FileFormat;
  if (config.value && format != config.value?.format) {
    requests.push(uploadConfig({ ...config.value, format }));
  }

  await Promise.all(requests);
}
const fileHandler = props.fileHandler || defaultFileHandler;
</script>

<template>
  <FileUpload
    :file-handler="fileHandler"
    :primary="primary"
    :accept="extensionsAccept"
    multiple
    show-progress
  >
    <UploadSizeLimits />
  </FileUpload>
</template>
