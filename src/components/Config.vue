<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table v-if="config" class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("fileFormat") }}</th>
          <td>
            <span v-if="config.format">
              {{ $t(config.format) }}
              (<code>.{{ config.format }}</code
              >)
            </span>
          </td>
        </tr>
        <tr v-if="config.textAnnotation">
          <th>{{ $t("text_annotation") }}</th>
          <td>
            <code>{{ config.textAnnotation }}</code>
          </td>
        </tr>
        <tr v-if="config.format != 'xml'">
          <th>{{ $t("segmenter_sentence") }}</th>
          <td>
            {{
              config.sentenceSegmenter
                ? $t(`segmenter_${config.sentenceSegmenter}`)
                : $t("none")
            }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("timespan") }}</th>
          <td>
            <span v-if="config.datetimeFrom || config.datetimeTo">
              {{ config.datetimeFrom }} – {{ config.datetimeTo }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>

<script setup>
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";
import PendingContent from "./PendingContent.vue";

const corpusId = useCorpusIdParam();
const { config, loadConfig } = useConfig(corpusId);

loadConfig();
</script>

<style></style>
