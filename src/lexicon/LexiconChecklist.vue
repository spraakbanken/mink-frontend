<script lang="ts" setup>
import { PhArrowSquareOut } from "@phosphor-icons/vue";
import { useLexicon } from "./lexicon.composable";
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

const { lexiconSettings } = useAppConfig();
const { sources, extensions } = useSources("lexicon", props.id);
const { job } = useResource<"lexicon">(props.id);
const { configOptions } = useLexicon(props.id);
const { th } = useLocale();

const karpsUrl =
  lexiconSettings.karps && ensureTrailingSlash(lexiconSettings.karps.url);
const karpredUrl =
  lexiconSettings.karpred && ensureTrailingSlash(lexiconSettings.karpred.url);
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
              :to="`/library/lexicon/${id}/sources`"
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
        <ChecklistItem v-if="configOptions" status="success">
          {{ $t("config.is_valid") }}

          <template #actions>
            <router-link
              v-if="!th(configOptions?.name)"
              :to="`/library/lexicon/${id}/config`"
              class="link-primary"
            >
              {{ $t("config.set_name") }}
            </router-link>
          </template>
        </ChecklistItem>

        <ChecklistItem v-else status="error">
          {{ $t("none") }}

          <template #actions>
            <router-link
              :to="`/library/lexicon/${id}/config`"
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
        <ChecklistItem
          v-if="job"
          :status="STATUS_MAP[job.status.karp_pipeline]"
        >
          {{ $t(`job.status.${job.status.karp_pipeline}`) }}

          <template #actions>
            <router-link
              v-if="
                sources.length &&
                configOptions &&
                STATUS_MAP[job.status.karp_pipeline] != 'success'
              "
              :to="`/library/lexicon/${id}/analyse`"
              class="link-primary"
            >
              {{ $t("analysis") }}
            </router-link>
          </template>
        </ChecklistItem>
      </td>
    </tr>

    <tr v-if="lexiconSettings.karpred">
      <td>{{ $t("checklist.explore_in", { tool: $t("lexicon.karpred") }) }}</td>
      <td>
        <template v-if="job">
          <ChecklistItem
            v-if="job.status.karp_pipeline == 'done'"
            :status="STATUS_MAP[job.status.karpred]"
          >
            {{ $t(`job.status.${job.status.karpred}`) }}

            <template #actions>
              <router-link
                v-if="STATUS_MAP[job.status.karpred] != 'success'"
                :to="`/library/lexicon/${id}/explore`"
                class="link-primary"
              >
                {{ $t("exports.tools.install") }}
              </router-link>
              <a
                v-else
                :href="`${karpredUrl}?mode=mink&lexicon=${id}`"
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
      <td>{{ $t("checklist.explore_in", { tool: $t("lexicon.karps") }) }}</td>
      <td>
        <template v-if="job">
          <ChecklistItem
            v-if="job.status.karp_pipeline == 'done'"
            :status="STATUS_MAP[job.status.karps]"
          >
            {{ $t(`job.status.${job.status.karps}`) }}

            <template #actions>
              <router-link
                v-if="STATUS_MAP[job.status.karps] != 'success'"
                :to="`/library/lexicon/${id}/explore`"
                class="link-primary"
              >
                {{ $t("exports.tools.install") }}
              </router-link>
              <a
                v-else
                :href="`${karpsUrl}?resources=${id}`"
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
