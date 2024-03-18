<script setup lang="ts">
import { onMounted } from "vue";
import { type Resource, isCorpus } from "@/store/resource.store";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useConfig from "@/corpus/config/config.composable";
import PendingContent from "@/spin/PendingContent.vue";

const props = defineProps<{
  resourceId: string;
  resource: Resource;
}>();

const { loadConfig } = useConfig(props.resourceId);

onMounted(() => {
  if (isCorpus(props.resource) && !props.resource.config) loadConfig();
});
</script>

<template>
  <div class="flex flex-wrap items-stretch text-sm">
    <table v-if="resource" class="flex-1 flex">
      <tbody>
        <tr>
          <th>{{ $t("type") }}</th>
          <td>{{ $t(resource.type) }}</td>
        </tr>

        <template v-if="isCorpus(resource)">
          <tr>
            <th>{{ $t("texts") }}</th>
            <td>
              <div
                v-for="source in resource.sources.slice(0, 3)"
                :key="source.name"
              >
                {{ source.name }}
              </div>
              <div v-if="resource.sources.length > 3">
                ... ({{ $t("files", resource.sources.length) }})
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t("job.status") }}</th>
            <td>
              <table>
                <tr
                  v-for="(status, jobType) in resource.status.status"
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
      v-if="isCorpus(resource)"
      :on="`corpus/${resourceId}/config`"
      class="flex-1"
    >
      <h3 class="font-bold">{{ $t("configuration") }}</h3>
      <TerminalOutput class="max-h-80">
        {{ resource.config }}
      </TerminalOutput>
    </PendingContent>
  </div>
</template>

<style scoped>
* + tr > th,
* + tr > td {
  @apply pt-2;
}
td th,
td td {
  @apply pt-0;
}
</style>
