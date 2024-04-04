<script setup lang="ts">
import type { FormKitOptionsList } from "@formkit/inputs";
import type { AxiosError } from "axios";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { MinkResponse } from "@/api/api.types";
import {
  type ConfigOptions,
  FORMATS_EXT,
  type FileFormat,
  SEGMENTERS,
  emptyConfig,
} from "@/api/corpusConfig";
import type { ConfigSentenceSegmenter } from "@/api/sparvConfig.types";
import HelpBox from "@/components/HelpBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import RouteButton from "@/components/RouteButton.vue";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useSources from "@/corpus/sources/sources.composable";
import useConfig from "@/corpus/config/config.composable";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert, alertError } = useMessenger();
const { extensions } = useSources(corpusId);
const { t } = useI18n();

type Form = {
  format: FileFormat;
  textAnnotation: string;
  sentenceSegmenter: ConfigSentenceSegmenter;
  datetimeFrom: string;
  datetimeTo: string;
  enableNer: boolean;
};

const formatOptions = computed<FormKitOptionsList>(() =>
  FORMATS_EXT.map((ext) => ({
    value: ext,
    label: `${t(ext)} (.${ext})`,
    // If there are source files, disable all formats not present there.
    attrs: {
      disabled: extensions.value.length > 0 && !extensions.value.includes(ext),
    },
  })),
);

// Auto-select the file format present among source files, if any.
const selectedFormat = computed<FileFormat | undefined>(() =>
  config.value?.format && extensions.value.includes(config.value?.format)
    ? config.value?.format
    : undefined,
);

type SegmenterOptions = Record<ConfigSentenceSegmenter | "", string>;

const segmenterOptions = computed<SegmenterOptions>(() => {
  const options: Partial<SegmenterOptions> = { "": t("none") };
  for (const segmenter of SEGMENTERS) {
    options[segmenter] = t(`segmenter_${segmenter}`);
  }
  return options as SegmenterOptions;
});

async function submit(fields: Form) {
  const corpusIdFixed = corpusId;
  // If there is no previous config file, start from a minimal one.
  const configOld = config.value || emptyConfig();
  // Merge new form values with existing config.
  const configNew: ConfigOptions = {
    ...configOld,
    format: fields.format,
    textAnnotation: fields.textAnnotation,
    sentenceSegmenter: fields.sentenceSegmenter,
    datetimeFrom: fields.datetimeFrom,
    datetimeTo: fields.datetimeTo,
    enableNer: fields.enableNer,
  };
  try {
    await uploadConfig(configNew);
    router.push(`/library/corpus/${corpusIdFixed}`);
  } catch (e) {
    if (e instanceof TypeError) {
      alert(e.message, "error");
    } else alertError(e as AxiosError<MinkResponse>);
  }
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <FormKit
      id="corpus-config"
      v-slot="{ value }"
      type="form"
      :submit-label="$t('save')"
      :submit-attrs="{
        inputClass: 'mink-button button-primary',
      }"
      @submit="submit"
    >
      <LayoutSection :title="$t('configuration')">
        <HelpBox>
          <p>{{ $t("config.configuration.help") }}</p>
        </HelpBox>

        <FormKit
          name="format"
          :label="$t('fileFormat')"
          :value="selectedFormat"
          type="select"
          :placeholder="$t('select')"
          input-class="w-72"
          :options="formatOptions"
          validation="required"
          :help="$t('config.format.help')"
        />

        <HelpBox v-if="value!.format === 'pdf'" important>
          <icon :icon="['far', 'lightbulb']" class="mr-1" />
          {{ $t("config.format.note.pdf") }}
        </HelpBox>

        <FormKit
          v-if="value!.format === 'xml'"
          name="textAnnotation"
          :label="$t('config.text_annotation')"
          type="text"
          :value="config?.textAnnotation"
          validation="required:trim|matches:/^[^<>\s]*$/"
          input-class="w-40 font-mono"
          :help="$t('config.text_annotation.help')"
        >
          <template #prefix> &lt; </template>
          <template #suffix> &gt; </template>
        </FormKit>

        <FormKit
          name="sentenceSegmenter"
          :label="$t('segmenter_sentence')"
          :value="config?.sentenceSegmenter || ''"
          type="radio"
          :options="segmenterOptions"
          :help="$t('segmenter_sentence_help')"
        />

        <FormKit
          name="datetimeFrom"
          type="date"
          :label="`${$t('timespan')}: ${$t('timespan_from')}`"
          :value="config?.datetimeFrom"
        />
        <FormKit
          name="datetimeTo"
          type="date"
          :label="`${$t('timespan')}: ${$t('timespan_to')}`"
          :value="config?.datetimeTo"
          :help="$t('timespan_help')"
        />

        <LayoutSection :title="$t('annotations')">
          <FormKit
            name="enableNer"
            :label="$t('annotations.ner')"
            :value="config?.enableNer"
            type="checkbox"
            :help="$t('annotations.ner.help')"
          />

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="prose" v-html="$t('annotations.info')" />
        </LayoutSection>
      </LayoutSection>
    </FormKit>
    <div class="flex justify-center">
      <RouteButton
        :to="`/library/corpus/${corpusId}/delete`"
        class="button-danger"
      >
        <icon :icon="['far', 'trash-can']" class="mr-1" />
        {{ $t("corpus.delete") }}
      </RouteButton>
    </div>
  </PendingContent>
</template>

<style scoped>
.prose :deep(ul) {
  padding-left: 2em;
}
.prose :deep(ul li) {
  list-style-type: bullet;
}
</style>
