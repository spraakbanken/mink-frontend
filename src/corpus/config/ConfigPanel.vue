<script setup lang="ts">
import useConfig from "@/corpus/config/config.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { config } = useConfig(corpusId);
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("fileFormat") }}</th>
          <td v-if="config?.format">
            {{ $t(config.format) }}
            (<code>.{{ config.format }}</code
            >)
          </td>
          <td v-else>—</td>
        </tr>
        <tr v-if="config?.textAnnotation">
          <th>{{ $t("config.text_annotation") }}</th>
          <td>
            <code>{{ config.textAnnotation }}</code>
          </td>
        </tr>
        <tr v-if="config?.format != 'xml'">
          <th>{{ $t("segmenter_sentence") }}</th>
          <td v-if="config">
            {{
              config.sentenceSegmenter
                ? $t(`segmenter_${config.sentenceSegmenter}`)
                : $t("none")
            }}
          </td>
          <td v-else>—</td>
        </tr>
        <tr>
          <th>{{ $t("timespan") }}</th>
          <td v-if="config?.datetimeFrom || config?.datetimeTo">
            <span class="whitespace-nowrap">{{ config.datetimeFrom }}</span> –
            <span class="whitespace-nowrap">{{ config.datetimeTo }}</span>
          </td>
          <td v-else>—</td>
        </tr>
        <tr>
          <th>{{ $t("annotations.ner") }}</th>
          <td v-if="config">
            {{ config.enableNer ? $t("enabled") : $t("disabled") }}
          </td>
          <td v-else>—</td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>
