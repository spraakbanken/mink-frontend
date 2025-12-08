<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { getInfo } from "@/api/apiInfo";
import useLocale from "@/i18n/locale.composable";

const info = computedAsync(getInfo);
// Use filesize with precision 0 to have "1 MB" instead of "1.0 MB".
const { filesize } = useLocale();
</script>

<template>
  <table v-if="info" class="text-sm">
    <tbody>
      <tr>
        <th>{{ $t("source.limit.file.recommended") }}</th>
        <td class="text-right">
          {{ filesize(info.recommendedFileSize.max_file_length.value, 0) }}
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
