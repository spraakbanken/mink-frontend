<script setup lang="ts">
import { computed } from "vue";
import { useCorpus } from "../corpus.composable";
import useLocale from "@/i18n/locale.composable";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";

const props = defineProps<{
  corpusId: string;
}>();

const { configOptions } = useCorpus(props.corpusId);
const { th } = useLocale();

const analyses = computed(() => {
  const map = configOptions.value?.analyses || {};
  const ids = [];
  for (const id in map) if (map[id]) ids.push(id);
  return ids;
});
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table class="w-full">
      <tbody>
        <tr>
          <td colspan="2">
            <h3 class="text-lg uppercase mb-2">{{ $t("metadata") }}</h3>
          </td>
        </tr>
        <tr>
          <th>{{ $t("name") }}</th>
          <td>
            {{ th(configOptions?.name) || "—" }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("description") }}</th>
          <td>
            {{ th(configOptions?.description) || "—" }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("identifier") }}</th>
          <td>
            <TerminalOutput class="inline leading-loose">
              {{ corpusId }}
            </TerminalOutput>
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <h3 class="text-lg uppercase my-2">{{ $t("settings") }}</h3>
          </td>
        </tr>
        <tr>
          <th>{{ $t("fileFormat") }}</th>
          <td v-if="configOptions?.format">
            {{ $t(configOptions.format) }}
            (<code>.{{ configOptions.format }}</code
            >)
          </td>
          <td v-else>—</td>
        </tr>
        <tr v-if="configOptions?.textAnnotation">
          <th>{{ $t("config.text_annotation") }}</th>
          <td>
            <TerminalOutput class="inline leading-loose"
              >&lt;{{ configOptions.textAnnotation }}&gt;</TerminalOutput
            >
          </td>
        </tr>
        <tr v-if="configOptions?.format != 'xml'">
          <th>{{ $t("segmenter_sentence") }}</th>
          <td v-if="configOptions">
            {{
              configOptions.sentenceSegmenter
                ? $t(`segmenter_${configOptions.sentenceSegmenter}`)
                : $t("none")
            }}
          </td>
          <td v-else>—</td>
        </tr>
        <tr>
          <th>{{ $t("timespan") }}</th>
          <td v-if="configOptions?.datetime">
            <span class="whitespace-nowrap">
              {{ configOptions.datetime.from }}
            </span>
            –
            <span class="whitespace-nowrap">
              {{ configOptions.datetime.to }}
            </span>
          </td>
          <td v-else>—</td>
        </tr>

        <tr>
          <td colspan="2">
            <h3 class="text-lg uppercase my-2">{{ $t("analysis") }}</h3>
          </td>
        </tr>
        <tr>
          <th>{{ $t("config.analyses") }}</th>
          <td v-if="analyses?.length">
            {{ $t("config.analyses.selected_count", analyses.length) }}
          </td>
          <td v-else>—</td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>
