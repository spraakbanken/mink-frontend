<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section :title="$t('metadata')">
      <table v-if="config" class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td><ValuesByKey :values="config.name" /></td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td><ValuesByKey :values="config.description" /></td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("identifier") }}</th>
            <td>
              <TerminalOutput>{{ corpusId }}</TerminalOutput>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
    <Section :title="$t('configuration')">
      <table v-if="config" class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("fileFormat") }}</th>
            <td>
              <span v-if="config.format">
                {{ $t(config.format) }}
                (<code>.{{ config.format }}</code
                >)
              </span>
            </td>
          </tr>
          <tr v-if="config.textAnnotation">
            <th class="lg:w-1/6">{{ $t("text_annotation") }}</th>
            <td>
              <code>{{ config.textAnnotation }}</code>
            </td>
          </tr>
          <tr v-if="config.format != 'xml'">
            <th class="lg:w-1/6">{{ $t("segmenter_sentence") }}</th>
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

      <div class="flex justify-center">
        <router-link :to="`/corpus/${corpusId}/config`">
          <ActionButton variant="primary" class="mr-4">
            <icon :icon="['fas', 'pen']" class="mr-1" />
            {{ $t("edit") }}
          </ActionButton>
        </router-link>
        <router-link :to="`/corpus/${corpusId}/delete`">
          <ActionButton variant="danger">
            <icon :icon="['far', 'trash-can']" class="mr-1" />
            {{ $t("corpus.delete") }}
          </ActionButton>
        </router-link>
      </div>
    </Section>
  </PendingContent>
</template>

<script setup>
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useConfig from "@/composables/config";
import ValuesByKey from "@/components/ValuesByKey.vue";

const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();

loadConfig();
</script>

<style></style>
