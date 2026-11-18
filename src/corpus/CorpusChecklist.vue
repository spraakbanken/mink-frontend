<script lang="ts" setup>
import { PhArrowSquareOut } from "@phosphor-icons/vue";
import { useCorpus } from "./corpus.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import ChecklistTable from "@/components/ChecklistTable.vue";
import ChecklistItem, { STATUS_MAP } from "@/components/ChecklistItem.vue";
import { useAppConfig } from "@/app/useAppConfig";
import { ensureTrailingSlash } from "@/util";
import useLocale from "@/i18n/locale.composable";

const props = defineProps<{
  id: string;
}>();

const { corpusSettings } = useAppConfig();
const { isConfigValid } = useCorpus(props.id);
const { sources, extensions } = useSources("corpus", props.id);
const { job } = useResource<"corpus">(props.id);
const { locale3 } = useLocale();

const korpUrl =
  corpusSettings.explore?.korp &&
  ensureTrailingSlash(corpusSettings.explore.korp.url);
const strixUrl =
  corpusSettings.explore?.strix &&
  ensureTrailingSlash(corpusSettings.explore.strix.url);
</script>

<template>
  <ChecklistTable>
    <tr>
      <td>{{ $t("checklist.sources") }}</td>
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
      <td>{{ $t("checklist.config") }}</td>
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
      <td>{{ $t("checklist.analyze") }}</td>
      <td>
        <ChecklistItem v-if="job" :status="STATUS_MAP[job.status.sparv]">
          {{ $t(`job.status.${job.status.sparv}`) }}

          <template #actions>
            <router-link
              v-if="
                sources.length &&
                isConfigValid &&
                STATUS_MAP[job.status.sparv] != 'success'
              "
              :to="`/library/corpus/${id}/analyse`"
              class="link-primary"
            >
              {{ $t("analysis") }}
            </router-link>

            <router-link
              v-else-if="STATUS_MAP[job.status.sparv] == 'success'"
              :to="`/library/corpus/${id}/exports`"
              class="link-primary"
            >
              {{ $t("download") }}
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

            <template #actions>
              <a
                v-if="STATUS_MAP[job.status.korp] == 'success'"
                :href="`${korpUrl}?mode=mink#?corpus=${id}&lang=${locale3}`"
                target="_blank"
                class="flex items-baseline link-primary"
              >
                <PhArrowSquareOut weight="bold" class="self-center mr-1" />
                {{ $t("exports.tools.view") }}
              </a>
            </template>
          </ChecklistItem>

          <ChecklistItem v-else>
            {{ $t("checklist.analysis_required") }}
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

            <template #actions>
              <a
                v-if="STATUS_MAP[job.status.strix] == 'success'"
                :href="`${strixUrl}?mode=mink&corpora=${id}`"
                target="_blank"
                class="flex items-baseline link-primary"
              >
                <PhArrowSquareOut weight="bold" class="self-center mr-1" />
                {{ $t("exports.tools.view") }}
              </a>
            </template>
          </ChecklistItem>

          <ChecklistItem v-else>
            {{ $t("checklist.analysis_required") }}
          </ChecklistItem>
        </template>
      </td>
    </tr>
  </ChecklistTable>
</template>
