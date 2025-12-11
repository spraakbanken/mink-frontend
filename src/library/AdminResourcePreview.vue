<script setup lang="ts">
import { onMounted } from "vue";
import { type Resource, isCorpus } from "@/store/resource.types";
import PendingContent from "@/spin/PendingContent.vue";
import TextData from "@/components/TextData.vue";
import { useCorpusStore } from "@/store/corpus.store";

const props = defineProps<{
  resourceId: string;
  resource: Resource;
}>();

const corpusStore = useCorpusStore();

onMounted(() => {
  if (isCorpus(props.resource)) corpusStore.loadConfig(props.resourceId);
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
            <td v-if="resource.sources">
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
      v-if="isCorpus(resource) && resource.config"
      :on="`corpus/${resourceId}/config`"
      class="flex-1"
    >
      <h3 class="font-semibold">{{ $t("configuration") }}</h3>
      <TextData :text="resource.config" language="yaml" />
    </PendingContent>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

* + tr > th,
* + tr > td {
  @apply pt-2;
}
td th,
td td {
  @apply pt-0;
}
</style>
