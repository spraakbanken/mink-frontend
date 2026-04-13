<script setup lang="ts">
import { computed } from "vue";
import { PhTrash } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import UploadSizeLimits from "./UploadSizeLimits.vue";
import { getInfo } from "@/api/apiInfo";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import MaxHeight from "@/components/MaxHeight.vue";
import type { FileMeta, ProgressHandler, ResourceType } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import FileUpload from "@/components/FileUpload.vue";
import { useAuth } from "@/auth/auth.composable";
import { type ResourceType as AuthResourceType } from "@/api/sbauth";
import SortableTable, {
  type SortableTableColumn,
} from "@/components/SortableTable.vue";
import { useResourceStore } from "@/store/resource.store";
import useSources from "@/resource/sources.composable";

const props = defineProps<{
  type: ResourceType;
  id: string;
}>();

const emit = defineEmits<{
  (e: "upload", extension: string): void;
}>();

const { deleteSource, uploadSources, extensions } = useSources(
  props.type,
  props.id,
);
const { loadResource } = useResourceStore();
const { filesize } = useLocale();
const { alertError } = useMessenger();
const { t, locale } = useI18n();
const { canWrite } = useAuth();

const resource = computedAsync(() => loadResource(props.id));
const info = computedAsync(getInfo);
const totalSize = computed(() =>
  (resource.value?.sources || []).reduce(
    (sum, source) => sum + Number(source.size),
    0,
  ),
);
const accept = computed(() => extensions.value.map((ext) => `.${ext}`).join());
// TODO Move somewhere central
const authResourceType = computed(() => {
  const mapping = {
    corpus: "corpora",
    lexicon: "lexica",
    metadata: "metadata",
  };
  return mapping[props.type] as AuthResourceType;
});

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

  if (canWrite(authResourceType.value, props.id))
    cols.push({ title: t("file.operations"), thClass: "sr-only" });

  return cols;
});

async function fileHandler(files: File[], onProgress: ProgressHandler) {
  if (!files[0]) throw new RangeError("No files");

  // Notify parent component of upload
  const extension = getFilenameExtension(files[0].name);
  emit("upload", extension.toLowerCase());

  await uploadSources(files, onProgress).catch(alertError);
}
</script>

<template>
  <div class="flex flex-wrap gap-x-8">
    <span>
      {{ $t("files", resource?.sources.length || 0) }},
      {{ filesize(totalSize) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.total.recommended") }}:
      {{ filesize(info.recommendedFileSize.recommended_min_file_length.value) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.total.max") }}:
      {{ filesize(info.fileSizeLimits.max_resource_length.value) }}
    </span>
  </div>
  <MaxHeight :max-height="400">
    <PendingContent :on="`${id}/sources/list`">
      <SortableTable
        v-if="resource?.sources.length"
        :columns
        :rows="resource.sources"
        :get-row-key="(source) => source.path"
        :default-sort="{ title: columns[0].title, reverse: false }"
        class="w-full mt-4 striped"
      >
        <template v-slot="{ row: source }">
          <td>
            <router-link :to="`/library/${type}/${id}/sources/${source.name}`">
              {{ source.name }}
            </router-link>
          </td>
          <td class="text-end whitespace-nowrap">
            {{ filesize(source.size) }}
          </td>
          <td v-if="canWrite(authResourceType, id)">
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
    v-if="canWrite(authResourceType, id)"
    :on="`${id}/sources/upload`"
    blocking
  >
    <FileUpload
      :file-handler
      :primary="!resource?.sources.length"
      :accept
      multiple
      show-progress
    >
      <UploadSizeLimits />
    </FileUpload>
  </PendingContent>
</template>
