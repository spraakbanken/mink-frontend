<template>
  <div v-if="config">
    <FormKit
      id="corpus-config"
      v-slot="{ value }"
      type="form"
      :submit-label="$t('save')"
      :submit-attrs="{
        inputClass: 'mink-button mink-primary',
      }"
      @submit="submit"
    >
      <Section :title="$t('configuration')">
        <Help>
          <p>{{ $t("config.configuration.help") }}</p>
        </Help>

        <FormKit
          name="format"
          :label="$t('fileFormat')"
          :value="config.format"
          type="select"
          input-class="w-72"
          :options="formatOptions"
          validate="required"
          :help="$t('config.format.help')"
        />

        <FormKit
          v-if="value.format === 'xml'"
          name="textAnnotation"
          :label="$t('config.text_annotation')"
          type="text"
          :value="config.textAnnotation"
          validation="required:trim|matches:/^[^<>\s]*$/"
          input-class="w-40 font-mono"
          :help="$t('config.text_annotation.help')"
        >
          <template #prefix>&lt;</template>
          <template #suffix>&gt;</template>
        </FormKit>

        <FormKit
          v-if="value.format != 'xml'"
          name="sentenceSegmenter"
          :label="$t('segmenter_sentence')"
          :value="config.sentenceSegmenter || ''"
          type="radio"
          :options="segmenterOptions"
          :help="$t('segmenter_sentence_help')"
        />

        <FormKit
          name="datetimeFrom"
          type="date"
          :label="`${$t('timespan')}: ${$t('timespan_from')}`"
          :value="config.datetimeFrom"
        />
        <FormKit
          name="datetimeTo"
          type="date"
          :label="`${$t('timespan')}: ${$t('timespan_to')}`"
          :value="config.datetimeTo"
          :help="$t('timespan_help')"
        />
      </Section>
    </FormKit>
    <div class="flex justify-center">
      <PendingContent :on="`corpus/${corpusId}/config`">
        <router-link :to="`/corpus/${corpusId}/delete`">
          <ActionButton variant="danger">
            <icon :icon="['far', 'trash-can']" class="mr-1" />
            {{ $t("corpus.delete") }}
          </ActionButton>
        </router-link>
      </PendingContent>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useConfig from "./config.composable";
import { FORMATS_EXT, SEGMENTERS } from "@/api/corpusConfig";
import useMessenger from "@/message/messenger.composable";
import Help from "@/components/Help.vue";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const formatOptions = computed(() =>
  FORMATS_EXT.reduce(
    (options, ext) => ({
      ...options,
      [ext]: `${t(ext)} (.${ext})`,
    }),
    {}
  )
);

const segmenterOptions = computed(() =>
  SEGMENTERS.reduce(
    (options, segmenter) => ({
      ...options,
      [segmenter]: t(`segmenter_${segmenter}`),
    }),
    { "": t("none") }
  )
);

async function submit(fields) {
  const corpusIdFixed = corpusId;
  const configNew = {
    ...config.value,
    format: fields.format,
    textAnnotation: fields.textAnnotation,
    sentenceSegmenter: fields.sentenceSegmenter,
    datetimeFrom: fields.datetimeFrom,
    datetimeTo: fields.datetimeTo,
  };
  try {
    await uploadConfig(configNew, corpusIdFixed);
    router.push(`/corpus/${corpusIdFixed}`);
  } catch (e) {
    if (e.name == "TypeError") {
      alert(e.message, "error");
    } else alertError(e);
  }
}
</script>

<style></style>
