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
import type { FileMeta, ProgressHandler } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import { FORMATS_EXT, type FileFormat } from "@/api/corpusConfig";
import FileUpload from "@/components/FileUpload.vue";
import { useAuth } from "@/auth/auth.composable";
import SortableTable, {
  type SortableTableColumn,
} from "@/components/SortableTable.vue";

const props = defineProps<{
  id: string;
}>();

const {
  sources,
  hasSources,
  deleteSource,
  uploadSources,
  extensions,
  configOptions,
  saveConfigOptions,
} = useCorpus(props.id);
const { filesize } = useLocale();
const { alert, alertError } = useMessenger();
const { t, locale } = useI18n();
const { canWrite } = useAuth();

const info = computedAsync(getInfo);
const totalSize = computed(() =>
  (sources.value || []).reduce((sum, source) => sum + Number(source.size), 0),
);

const columns = computed<SortableTableColumn<FileMeta>[]>(() => {
  const cols: SortableTableColumn<FileMeta>[] = [
    {
      title: t("filename"),
      thClass: "w-full",
      comparator: (a, b) => a.name.localeCompare(b.name, locale.value),
    },
    {
      title: t("fileSize"),
      thClass: "text-end",
      comparator: (a, b) => a.size - b.size,
    },
  ];

  if (canWrite("corpora", props.id))
    cols.push({ title: t("file.operations"), thClass: "sr-only" });

  return cols;
});

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
    <span>
      {{ $t("files", sources?.length || 0) }}, {{ filesize(totalSize) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.corpus.recommended") }}:
      {{ filesize(info.recommendedFileSize.recommended_min_file_length.value) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.corpus.max") }}:
      {{ filesize(info.fileSizeLimits.max_resource_length.value) }}
    </span>
  </div>
  <MaxHeight :max-height="400">
    <PendingContent :on="`${id}/sources/list`">
      <SortableTable
        v-if="sources?.length"
        :columns
        :rows="sources"
        :get-row-key="(source) => source.path"
        :default-sort="{ title: columns[0].title, reverse: false }"
        class="w-full mt-4 striped"
      >
        <template v-slot="{ row: source }">
          <td>
            <router-link :to="`/library/corpus/${id}/sources/${source.name}`">
              {{ source.name }}
            </router-link>
          </td>
          <td class="text-end whitespace-nowrap">
            {{ filesize(source.size) }}
          </td>
          <td v-if="canWrite('corpora', id)">
            <ActionButton
              class="hover:button-danger button-slim text-sm"
              @click="deleteSource(source).catch(alertError)"
            >
              <PhTrash class="inline mb-0.5" />
              <span class="sr-only">{{ $t("delete") }}</span>
            </ActionButton>
          </td>
        </template>
      </SortableTable>
    </PendingContent>
  </MaxHeight>

  <PendingContent
    v-if="canWrite('corpora', id)"
    :on="`${id}/sources/upload`"
    blocking
  >
    <FileUpload
      :file-handler
      :primary="!hasSources"
      :accept="extensions"
      multiple
      show-progress
    >
      <UploadSizeLimits />
    </FileUpload>
  </PendingContent>
</template>
