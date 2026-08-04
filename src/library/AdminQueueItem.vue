<script lang="ts" setup>
import type { QueueItem } from "@/api/api.types";
import LayoutBox from "@/components/LayoutBox.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useLocale from "@/i18n/locale.composable";

defineProps<{
  item: QueueItem;
}>();

const { formatDate } = useLocale();
</script>

<template>
  <LayoutBox :class="{ 'bg-amber-50! dark:bg-amber-950!': item.started }">
    <div>
      <h3 class="inline text-lg font-mono font-semibold">
        <router-link :to="`/library/resource/${item.resource_id}`">
          {{ item.resource_id }}
        </router-link>
      </h3>
      <span class="ml-4">
        {{ $t(item.resource_type) }}
      </span>
    </div>
    <table>
      <tbody>
        <tr>
          <th>{{ $t("job.process") }}</th>
          <td class="pb-1">
            <TerminalOutput class="inline">
              {{ item.current_process }}
            </TerminalOutput>
          </td>
        </tr>
        <tr>
          <th>{{ $t("job.status") }}</th>
          <td>{{ $t(`job.status.${item.job_status}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t("job.priority") }}</th>
          <td>{{ item.priority || "–" }}</td>
        </tr>

        <tr>
          <th>{{ $t("job.queued") }}</th>
          <td>
            {{ formatDate(item.queued) }}
            <template v-if="item.age_reference == 'queued'">
              ({{ $t("seconds_ago", item.age_seconds) }})
            </template>
          </td>
        </tr>

        <tr v-if="item.started">
          <th>{{ $t("job.started") }}</th>
          <td>
            {{ formatDate(item.started) }}
            <template v-if="item.age_reference == 'started'">
              ({{ $t("seconds_ago", item.age_seconds) }})
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </LayoutBox>
</template>
