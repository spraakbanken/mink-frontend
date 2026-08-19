<script lang="ts" setup>
import { useCorpus } from "./corpus.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import ChecklistItem, {
  type ChecklistItemStatus,
} from "@/components/ChecklistItem.vue";
import type { JobState } from "@/api/api.types";

const props = defineProps<{
  id: string;
}>();

const { isConfigValid, exports } = useCorpus(props.id);
const { sources, extensions } = useSources("corpus", props.id);
const { job, isRunning } = useResource<"corpus">(props.id);

const STATUS_MAP: Record<JobState, ChecklistItemStatus> = {
  aborted: "none",
  done: "success",
  error: "error",
  none: "none",
  running: "success",
  waiting: "success",
};
</script>

<template>
  <div>
    <table class="w-full table-lined">
      <thead>
        <tr>
          <th>{{ $t("corpus.checklist.task") }}</th>
          <th>{{ $t("status") }}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{ $t("corpus.checklist.sources") }}</td>
          <td>
            <ChecklistItem v-if="sources.length" status="success">
              {{ $t(extensions[0]) }}
              (.{{ extensions[0] }}),
              {{ $t("files", sources.length) }}
            </ChecklistItem>

            <ChecklistItem v-else status="error">
              {{ $t("files", 0) }}

              <template #actions>
                <router-link
                  :to="`/library/corpus/${id}/sources`"
                  class="link-primary"
                >
                  {{ $t("upload") }}
                </router-link>
              </template>
            </ChecklistItem>
          </td>
        </tr>

        <tr>
          <td>{{ $t("corpus.checklist.config") }}</td>
          <td>
            <ChecklistItem v-if="isConfigValid" status="success">
              {{ $t("config.is_valid") }}
            </ChecklistItem>

            <ChecklistItem v-else status="error">
              {{ $t("config.is_invalid") }}

              <template #actions>
                <router-link
                  :to="`/library/corpus/${id}/config`"
                  class="link-primary"
                >
                  {{ $t("edit") }}
                </router-link>
              </template>
            </ChecklistItem>
          </td>
        </tr>

        <tr>
          <td>{{ $t("corpus.checklist.analyze") }}</td>
          <td>
            <ChecklistItem v-if="job" :status="STATUS_MAP[job.status.sparv]">
              {{ $t(`job.status.${job.status.sparv}`) }}

              <template
                v-if="
                  sources.length &&
                  isConfigValid &&
                  !isRunning &&
                  exports &&
                  !exports?.length
                "
                #actions
              >
                <router-link
                  :to="`/library/corpus/${id}/analyse`"
                  class="link-primary"
                >
                  {{ $t("analysis") }}
                </router-link>
              </template>
            </ChecklistItem>
          </td>
        </tr>

        <tr>
          <td>{{ $t("corpus.checklist.korp") }}</td>
          <td>
            <template v-if="job">
              <ChecklistItem
                v-if="job.status.sparv == 'done'"
                :status="STATUS_MAP[job.status.korp]"
              >
                {{ $t(`job.status.${job.status.korp}`) }}
              </ChecklistItem>
              <ChecklistItem v-else>
                {{ $t("corpus.checklist.analysis_required") }}
              </ChecklistItem>
            </template>
          </td>
        </tr>

        <tr>
          <td>{{ $t("corpus.checklist.strix") }}</td>
          <td>
            <template v-if="job">
              <ChecklistItem
                v-if="job.status.sparv == 'done'"
                :status="STATUS_MAP[job.status.strix]"
              >
                {{ $t(`job.status.${job.status.strix}`) }}
              </ChecklistItem>
              <ChecklistItem v-else>
                {{ $t("corpus.checklist.analysis_required") }}
              </ChecklistItem>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
