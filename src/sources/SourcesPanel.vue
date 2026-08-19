<script setup lang="ts">
import { computed } from "vue";
import { PhTrash } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { sumBy } from "es-toolkit";
import UploadSizeLimits from "./UploadSizeLimits.vue";
import { useApiInfo } from "@/api/apiInfo.composable.ts";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import MaxHeight from "@/components/MaxHeight.vue";
import type { FileMeta, ProgressHandler, ResourceType } from "@/api/api.types";
import useAlert from "@/alert/alert.composable";
import { getFilenameExtension } from "@/util";
import FileUpload from "@/components/FileUpload.vue";
import SortableTable, {
  type SortableTableColumn,
} from "@/components/SortableTable.vue";
import { useResourceStore } from "@/store/resource.store";
import useSources from "@/resource/sources.composable";
import { SOURCE_FORMATS } from "@/file";
import { useUserStore } from "@/store/user.store";

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
const { showAlert } = useAlert();
const { t, locale } = useI18n();
const { canWrite } = useUserStore();
const info = useApiInfo();

const resource = computedAsync(() => loadResource(props.id));

const accept = computed(() => {
  return extensions.value.length
    ? extensions.value
    : [...SOURCE_FORMATS[props.type]];
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

  if (canWrite(props.type, props.id))
    cols.push({ title: t("file.operations"), thClassInner: "sr-only" });

  return cols;
});

async function fileHandler(files: File[], onProgress: ProgressHandler) {
  if (!files[0]) throw new RangeError("No files");

  // Notify parent component of upload
  const extension = getFilenameExtension(files[0].name);
  emit("upload", extension.toLowerCase());

  await uploadSources(files, onProgress).catch(showAlert);
}
</script>

<template>
  <div class="mb-4 flex flex-wrap gap-x-8">
    <span>
      {{ $t("files", resource?.sources.length || 0) }}
    </span>
    <span v-if="info">
      {{
        $t("source.limit.of", [
          filesize(sumBy(resource?.sources || [], (source) => source.size)),
          filesize(info.max.resource, 0),
        ])
      }}
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
        class="w-full table-lined"
      >
        <template v-slot="{ row: source }">
          <td>
            <router-link
              :to="`/library/${type}/${id}/sources/file?path=${source.name}`"
              class="block"
            >
              {{ source.name }}
            </router-link>
          </td>
          <td class="text-end whitespace-nowrap">
            {{ filesize(source.size) }}
          </td>
          <td v-if="canWrite(type, id)">
            <ActionButton
              class="hover:button-danger button-slim text-sm"
              @click="deleteSource(source).catch(showAlert)"
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
    v-if="canWrite(type, id)"
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
      <UploadSizeLimits :type />
    </FileUpload>
  </PendingContent>
</template>
