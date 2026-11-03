<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { getInfo } from "@/api/apiInfo";
import useLocale from "@/i18n/locale.composable";

const info = computedAsync(getInfo);
// Use filesize with precision 0 to have "1 MB" instead of "1.0 MB".
const { filesize } = useLocale();

const recommended = computed(() => {
  if (!info.value) return "";
  const min = info.value.recommendedFileSize.recommended_min_file_length.value;
  const max = info.value.recommendedFileSize.recommended_max_file_length.value;
  if (min == max) return filesize(min, 0);
  return `${filesize(min, 0)}–${filesize(max, 0)}`;
});
</script>

<template>
  <table v-if="info" class="text-sm">
    <tbody>
      <tr>
        <th>{{ $t("source.limit.file.recommended") }}</th>
        <td class="text-right">
          {{ recommended }}
        </td>
      </tr>
      <tr>
        <th>{{ $t("source.limit.file.max") }}</th>
        <td class="text-right">
          {{ filesize(info.fileSizeLimits.max_file_length.value, 0) }}
        </td>
      </tr>
      <tr>
        <th>{{ $t("source.limit.upload.max") }}</th>
        <td class="text-right">
          {{ filesize(info.fileSizeLimits.max_content_length.value, 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
