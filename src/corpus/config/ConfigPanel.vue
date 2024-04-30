<script setup lang="ts">
import useLocale from "@/i18n/locale.composable";
import useConfig from "@/corpus/config/config.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";

const corpusId = useCorpusIdParam();
const { configOptions } = useConfig(corpusId);
const { th } = useLocale();
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table class="w-full">
      <td colspan="2">
        <h3 class="text-lg uppercase mb-2">{{ $t("metadata") }}</h3>
      </td>
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
          <h3 class="text-lg uppercase my-2">{{ $t("analysis") }}</h3>
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
        <td v-if="configOptions?.datetimeFrom || configOptions?.datetimeTo">
          <span class="whitespace-nowrap">{{
            configOptions.datetimeFrom
          }}</span>
          –
          <span class="whitespace-nowrap">{{ configOptions.datetimeTo }}</span>
        </td>
        <td v-else>—</td>
      </tr>
      <tr>
        <th>{{ $t("annotations.ner") }}</th>
        <td v-if="configOptions">
          {{ configOptions.enableNer ? $t("enabled") : $t("disabled") }}
        </td>
        <td v-else>—</td>
      </tr>
    </table>
  </PendingContent>
</template>
