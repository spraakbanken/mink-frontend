<script setup lang="ts">
import useConfig from "@/corpus/config/config.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { config } = useConfig(corpusId);
</script>

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
            <template v-else>—</template>
          </td>
        </tr>
        <tr v-if="config.textAnnotation">
          <th>{{ $t("config.text_annotation") }}</th>
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
              <span class="whitespace-nowrap">{{ config.datetimeFrom }}</span> –
              <span class="whitespace-nowrap">{{ config.datetimeTo }}</span>
            </span>
            <template v-else>—</template>
          </td>
        </tr>
        <tr>
          <th>{{ $t("annotations.ner") }}</th>
          <td>
            {{ config.enableNer ? $t("enabled") : $t("disabled") }}
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>
