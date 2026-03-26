<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { type Resource, isCorpus } from "@/store/resource.types";
import PendingContent from "@/spin/PendingContent.vue";
import TextData from "@/components/TextData.vue";
import useMessenger from "@/message/messenger.composable";
import { useConfigStore } from "@/store/config.store";

const props = defineProps<{
  id: string;
  resource: Resource;
}>();

const { loadConfig } = useConfigStore();
const { alertError } = useMessenger();

const config = computedAsync(() =>
  isCorpus(props.resource) ? loadConfig(props.id).catch(alertError) : undefined,
);
</script>

<template>
  <div class="flex flex-wrap items-stretch text-sm">
    <table
      v-if="resource"
      class="flex-1 flex border-separate border-spacing-2 -m-2"
    >
      <tbody>
        <tr>
          <th>{{ $t("type") }}</th>
          <td>{{ $t(resource.type) }}</td>
        </tr>

        <template v-if="isCorpus(resource)">
          <tr>
            <th>{{ $t("sources") }}</th>
            <td v-if="resource.sources">
              <div
                v-for="source in resource.sources.slice(0, 3)"
                :key="source.name"
              >
                {{ source.name }}
              </div>
              <div v-if="resource.sources.length > 3">
                … ({{ $t("files", resource.sources.length) }})
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t("job.status") }}</th>
            <td v-if="resource.job">
              <table>
                <tr
                  v-for="(status, jobType) in resource.job.status"
                  :key="jobType"
                >
                  <th>{{ jobType }}</th>
                  <td>{{ $t(`job.status.${status}`) }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <PendingContent
      v-if="isCorpus(resource) && config"
      :on="`${id}/config`"
      class="flex-1"
    >
      <h3 class="font-semibold">{{ $t("configuration") }}</h3>
      <TextData :text="config" language="yaml" />
    </PendingContent>
  </div>
</template>
