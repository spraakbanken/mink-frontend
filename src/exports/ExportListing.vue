<script setup lang="ts">
/** Listing table of export files */
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import ActionButton from "@/components/ActionButton.vue";
import useLocale from "@/i18n/locale.composable";
import type { FileMeta, ResourceType } from "@/api/api.types";
import useAlert from "@/alert/alert.composable";
import SortableTable from "@/components/SortableTable.vue";
import useExports from "@/exports/exports.composable";

const props = defineProps<{
  type: ResourceType;
  id: string;
  files: FileMeta[];
}>();

const { locale } = useI18n();
const { filesize } = useLocale();
const { downloadResultFile } = useExports(props.type, props.id);
const { showAlert } = useAlert();
</script>

<template>
  <SortableTable
    :columns="[
      {
        title: $t('filename'),
        comparator: (a, b) => a.name.localeCompare(b.name, locale),
      },
      {
        title: $t('fileSize'),
        thClass: 'text-end',
        comparator: (a, b) => a.size - b.size,
      },
      { title: $t('file.operations'), thClass: 'sr-only' },
    ]"
    :rows="files"
    :get-row-key="(file) => file.name"
    :default-sort="{ title: $t('filename'), reverse: false }"
    class="w-full mt-2 striped"
  >
    <template v-slot="{ row: file }">
      <!-- Filename link -->
      <td class="w-full">
        {{ file.path.slice(0, file.path.lastIndexOf("/") + 1)
        }}<router-link
          :to="`/library/${type}/${id}/exports/${encodeURIComponent(file.path)}`"
        >
          {{ file.name }}
        </router-link>
      </td>

      <!-- File size -->
      <td class="text-end whitespace-nowrap">
        {{ filesize(file.size) }}
      </td>

      <!-- Download button -->
      <td>
        <ActionButton
          class="button-slim"
          @click="downloadResultFile(file.path).catch(showAlert)"
        >
          <PhDownloadSimple class="inline mb-0.5" />
          <span class="sr-only">{{ $t("download") }}</span>
        </ActionButton>
      </td>
    </template>
  </SortableTable>
</template>
