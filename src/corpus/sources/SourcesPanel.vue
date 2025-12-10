<script setup lang="ts">
import { computed } from "vue";
import { PhTrash } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { useCorpus } from "../corpus.composable";
import UploadSizeLimits from "./UploadSizeLimits.vue";
import { getInfo } from "@/api/apiInfo";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import MaxHeight from "@/components/MaxHeight.vue";
import type { ProgressHandler } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import { FORMATS_EXT, type FileFormat } from "@/api/corpusConfig";
import FileUpload from "@/components/FileUpload.vue";
import { canWrite } from "@/auth/sbAuth";

const props = defineProps<{
  corpusId: string;
}>();

const {
  sources,
  hasSources,
  deleteSource,
  uploadSources,
  extensions,
  configOptions,
  saveConfigOptions,
} = useCorpus(props.corpusId);
const { filesize } = useLocale();
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const info = computedAsync(getInfo);
const totalSize = computed(() =>
  sources.value.reduce((sum, source) => sum + Number(source.size), 0),
);
const accept = computed(() => extensions.value.map((ext) => `.${ext}`).join());

async function fileHandler(files: File[], onProgress: ProgressHandler) {
  if (!files[0]) throw new RangeError("No files");
  const requests = [uploadSources(files, onProgress).catch(alertError)];

  // Also update format setting in config if needed
  const extension = getFilenameExtension(files[0].name);
  const format = extension.toLowerCase() as FileFormat;
  if (
    configOptions.value &&
    format != configOptions.value.format &&
    FORMATS_EXT.includes(format)
  ) {
    alert(
      t("source.upload.config_format.trigger_change", { format: t(format) }),
    );
    requests.push(saveConfigOptions({ ...configOptions.value, format }));
  }

  await Promise.all(requests);
}
</script>

<template>
  <div class="flex flex-wrap gap-x-8">
    <span>{{ $t("files", sources.length) }}, {{ filesize(totalSize) }}</span>
    <span v-if="info">
      {{ $t("source.limit.corpus.recommended") }}:
      {{ filesize(info.recommendedFileSize.min_file_length.value) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.corpus.max") }}:
      {{ filesize(info.fileSizeLimits.max_corpus_length.value) }}
    </span>
  </div>
  <MaxHeight :max-height="400">
    <PendingContent :on="`corpus/${corpusId}/sources/list`">
      <table v-if="sources.length" class="w-full mt-4 striped">
        <thead>
          <tr>
            <th class="w-full">{{ $t("fileName") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
            <th v-if="canWrite('corpora', corpusId)" class="sr-only">
              {{ $t("file.operations") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.path">
            <td>
              <router-link
                :to="`/library/corpus/${corpusId}/sources/${source.name}`"
              >
                {{ source.name }}
              </router-link>
            </td>
            <td class="text-right whitespace-nowrap">
              {{ filesize(source.size) }}
            </td>
            <td v-if="canWrite('corpora', corpusId)" class="text-right">
              <ActionButton
                class="button-danger button-mute button-slim text-sm"
                @click="deleteSource(source)"
              >
                <PhTrash class="inline mb-0.5" />
                <span class="sr-only">{{ $t("delete") }}</span>
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
    </PendingContent>
  </MaxHeight>

  <PendingContent
    v-if="canWrite('corpora', corpusId)"
    :on="`corpus/${corpusId}/sources/upload`"
    blocking
  >
    <FileUpload
      :file-handler
      :primary="!hasSources"
      :accept
      multiple
      show-progress
    >
      <UploadSizeLimits />
    </FileUpload>
  </PendingContent>
</template>
