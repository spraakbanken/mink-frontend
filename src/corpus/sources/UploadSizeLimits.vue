<script setup>
import useMinkBackend from "@/api/backend.composable";
import useLocale from "@/i18n/locale.composable";
import { computed } from "vue";

const { info } = useMinkBackend();
const { filesize } = useLocale();

const hasInfo = computed(() => Object.keys(info).length);

const findInfo = (field, name) =>
  info[field].data.find((item) => item.name == name).value;
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
