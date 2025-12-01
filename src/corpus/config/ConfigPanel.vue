<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useCorpus } from "../corpus.composable";
import useLocale from "@/i18n/locale.composable";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import { loadAnalysisMetdata } from "@/api/analysis";

const props = defineProps<{
  corpusId: string;
}>();

const { configOptions } = useCorpus(props.corpusId);
const { th, thCompare } = useLocale();

const analyses = computedAsync(async () => {
  if (!configOptions.value) return;
  // Get selected ids
  const map = configOptions.value.analyses;
  const ids = Object.keys(map).filter((id) => map[id]);
  // Get metadata for selected analyses
  const metadata = await loadAnalysisMetdata();
  return metadata
    .filter((analysis) => ids.includes(analysis.id))
    .sort(thCompare((x) => x.name));
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
          <td colspan="2">
            <details v-if="analyses">
              <summary>
                {{ $t("config.analyses.selected_count", analyses.length) }}
              </summary>
              <ul class="list-disc list-outside pl-5 mt-2">
                <li v-for="analysis of analyses" :key="analysis.id">
                  {{ th(analysis.name) }}
                  (<a :href="$t('analyses.url', analysis.id)" target="_blank">
                    {{ analysis.id }}</a
                  >)
                </li>
              </ul>
            </details>
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>
