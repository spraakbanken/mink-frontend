<script setup lang="ts">
import { computed } from "vue";
import { useApiInfo } from "@/api/apiInfo.composable";
import useLocale from "@/i18n/locale.composable";

const info = useApiInfo();
// Use filesize with precision 0 to have "1 MB" instead of "1.0 MB".
const { filesize } = useLocale();

const recommended = computed(() => {
  if (!info.value) return "";
  const [min, max] = info.value.corpusRecommended;
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
          {{ filesize(info.max.file, 0) }}
        </td>
      </tr>
      <tr>
        <th>{{ $t("source.limit.upload.max") }}</th>
        <td class="text-right">
          {{ filesize(info.max.upload, 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
