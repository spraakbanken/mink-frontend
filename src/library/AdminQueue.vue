<script lang="ts" setup>
import { useInterval, watchImmediate } from "@vueuse/core";
import { ref } from "vue";
import AdminQueueItem from "./AdminQueueItem.vue";
import useAlert from "@/alert/alert.composable";
import { useApi } from "@/api/useApi";
import LayoutBox from "@/components/LayoutBox.vue";
import useSpin from "@/spin/spin.composable";
import type { QueueHealthData } from "@/api/api.types";
import PendingContent from "@/spin/PendingContent.vue";

const api = useApi();
const ticker = useInterval(4000);
const { spin } = useSpin();
const { showAlert } = useAlert();

const data = ref<QueueHealthData>();

const loadQueue = () => spin(api.queueHealth(), "admin/queue").catch(showAlert);

watchImmediate(ticker, async () => (data.value = await loadQueue()));
</script>

<template>
  <PendingContent on="admin/queue">
    <LayoutBox :title="$t('admin.queue')">
      <ol v-if="data?.queue_jobs.length" class="flex flex-wrap gap-2">
        <li v-for="item in data.queue_jobs" :key="item.resource_id">
          <AdminQueueItem :item />
        </li>
      </ol>
      <span v-else class="italic">
        {{ $t("admin.queue.empty") }}
      </span>
    </LayoutBox>
  </PendingContent>
</template>
