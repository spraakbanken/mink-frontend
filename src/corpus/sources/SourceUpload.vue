<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import useConfig from "@/corpus/config/config.composable";
import useSources from "@/corpus/sources/sources.composable";
import UploadSizeLimits from "@/corpus/sources/UploadSizeLimits.vue";
import { getFilenameExtension } from "@/util";
import useMessenger from "@/message/messenger.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { FORMATS_EXT, type FileFormat } from "@/api/corpusConfig";
import FileUpload from "@/components/FileUpload.vue";
import type { ProgressHandler } from "@/api/api.types";

const props = defineProps<{
  fileHandler?: (files: File[]) => Promise<void>;
  primary?: boolean;
}>();

const corpusId = useCorpusIdParam();
const { uploadSources, extensions } = useSources(corpusId);
const { configOptions, uploadConfig } = useConfig(corpusId);
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const extensionsAccept = computed(() =>
  extensions.value?.map((ext) => `.${ext}`).join(),
);

async function defaultFileHandler(files: File[], onProgress: ProgressHandler) {
  const requests = [uploadSources(files, onProgress).catch(alertError)];

  // Also update format setting in config if needed
  const extension = getFilenameExtension(files[0]?.name);
  const format = extension.toLowerCase() as FileFormat;
  if (
    configOptions.value &&
    format != configOptions.value.format &&
    FORMATS_EXT.includes(format)
  ) {
    alert(
      t("source.upload.config_format.trigger_change", { format: t(format) }),
    );
    requests.push(uploadConfig({ ...configOptions.value, format }));
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
