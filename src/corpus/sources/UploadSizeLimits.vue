<script setup>
import useMinkBackendInfo from "@/api/backendInfo.composable";
import useLocale from "@/i18n/locale.composable";

const { hasInfo, findInfo } = useMinkBackendInfo();
// Use filesize with precision 0 to have "1 MB" instead of "1.0 MB".
const { filesize } = useLocale();
</script>

<template>
  <table v-if="hasInfo" class="text-sm">
    <tr>
      <th>{{ $t("source.limit.file.recommended") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("recommended_file_size", "max_file_length"), 0) }}
      </td>
    </tr>
    <tr>
      <th>{{ $t("source.limit.file.max") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("file_size_limits", "max_file_length"), 0) }}
      </td>
    </tr>
    <tr>
      <th>{{ $t("source.limit.upload.max") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("file_size_limits", "max_content_length"), 0) }}
      </td>
    </tr>
  </table>
</template>
