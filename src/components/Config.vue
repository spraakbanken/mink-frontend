<template>
  <table v-if="config" class="w-full my-4">
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
</template>

<script setup>
import useConfig from "@/composables/config";

const { config, loadConfig } = useConfig();

loadConfig();
</script>

<style></style>
