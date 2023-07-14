<script setup>
import useMinkBackendInfo from "@/api/backendInfo.composable";
import useLocale from "@/i18n/locale.composable";

const { hasInfo, findInfo } = useMinkBackendInfo();
const { filesize } = useLocale();
</script>

<template>
  <table v-if="hasInfo" class="text-sm">
    <tr>
      <th>{{ $t("source.limit.file.recommended") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("recommended_file_size", "max_file_length")) }}
      </td>
    </tr>
    <tr>
      <th>{{ $t("source.limit.file.max") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("file_size_limits", "max_file_length")) }}
      </td>
    </tr>
    <tr>
      <th>{{ $t("source.limit.upload.max") }}</th>
      <td class="text-right">
        {{ filesize(findInfo("file_size_limits", "max_content_length")) }}
      </td>
    </tr>
  </table>
</template>
