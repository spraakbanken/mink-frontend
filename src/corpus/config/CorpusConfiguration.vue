<template>
  <div v-if="config">
    <FormKit
      id="corpus-config"
      v-slot="{ value }"
      type="form"
      :actions="false"
      @submit="submit"
    >
      <Section :title="$t('metadata')">
        <Help>
          <p>{{ $t("config.metadata.help") }}</p>
        </Help>

        <FormKit type="group" name="name">
          <TaggedInput v-for="lang in ['swe', 'eng']" :key="lang" :tag="lang">
            <FormKit
              :name="lang"
              :label="$t('name')"
              type="text"
              input-class="w-72"
              validation="required:trim"
            />
          </TaggedInput>
        </FormKit>

        <FormKit type="group" name="description">
          <TaggedInput v-for="lang in ['swe', 'eng']" :key="lang" :tag="lang">
            <FormKit
              :name="lang"
              :label="$t('description')"
              type="textarea"
              input-class="w-full h-20"
            />
          </TaggedInput>
        </FormKit>

        <FormKit
          :label="$t('identifier')"
          type="text"
          name="identifier"
          disabled
          :value="corpusId"
          input-class="font-mono bg-stone-600 text-lime-50 text-xs p-2 rounded"
        />
      </Section>

      <Section :title="$t('configuration')">
        <Help>
          <p>{{ $t("config.configuration.help") }}</p>
        </Help>

        <FormKit
          id="fileFormat"
          name="fileFormat"
          :label="$t('fileFormat')"
          type="select"
          input-class="w-72"
          :options="fileFormatOptions"
          validate="required"
          :help="$t('config.format.help')"
        />

        <FormKit
          v-if="value.fileFormat === 'xml'"
          id="textAnnotation"
          name="textAnnotation"
          :label="$t('text_annotation')"
          validation="required:trim"
          input-class="w-72"
          :help="$t('text_annotation_help')"
        />

        <FormKit
          v-if="value.fileFormat != 'xml'"
          :label="$t('segmenter_sentence')"
          type="radio"
          :options="segmenterOptions"
          :help="$t('segmenter_sentence_help')"
        />

        <FormKit
          :label="`${$t('timespan')}: ${$t('timespan_from')}`"
          type="date"
        />
        <FormKit
          :label="`${$t('timespan')}: ${$t('timespan_to')}`"
          type="date"
          :help="$t('timespan_help')"
        />

        <table class="w-full my-4 striped">
          <thead></thead>
          <tbody>
            <tr v-if="format != 'xml'">
              <th class="lg:w-1/6">
                {{ $t("segmenter_sentence") }}
              </th>
              <td>
                <label class="mr-4">
                  <input
                    id="sentenceSegmenter"
                    v-model="sentenceSegmenter"
                    type="radio"
                    value=""
                  />
                  {{ $t("none") }}
                </label>
                <label v-for="segmenter in SEGMENTERS" class="mr-4">
                  <input
                    id="sentenceSegmenter"
                    v-model="sentenceSegmenter"
                    type="radio"
                    :value="segmenter"
                  />
                  {{ $t(`segmenter_${segmenter}`) }}
                </label>
                <div class="text-sm py-1">
                  {{ $t("segmenter_sentence_help") }}
                </div>
              </td>
            </tr>
            <tr>
              <th>
                {{ $t("timespan") }}
              </th>
              <td>
                {{ $t("timespan_from") }}:
                <input v-model="datetimeFrom" type="date" class="mr-4" />
                {{ $t("timespan_to") }}:
                <input v-model="datetimeTo" type="date" />
                <div class="text-sm py-1">
                  {{ $t("timespan_help") }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
      <Section>
        <div class="flex justify-center">
          <PendingContent :on="`corpus/${corpusId}/config`">
            <ActionButton variant="primary" @click="save">
              <icon :icon="['far', 'floppy-disk']" class="mr-1" />
              {{ $t("save") }}
            </ActionButton>

            <router-link :to="`/corpus/${corpusId}/delete`">
              <ActionButton variant="danger" class="ml-4">
                <icon :icon="['far', 'trash-can']" class="mr-1" />
                {{ $t("corpus.delete") }}
              </ActionButton>
            </router-link>
          </PendingContent>
        </div>
      </Section>
    </FormKit>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useConfig from "./config.composable";
import { FORMATS_EXT, SEGMENTERS } from "@/api/corpusConfig";
import TaggedInput from "./TaggedInput.vue";
import useMessenger from "@/message/messenger.composable";
import Help from "@/components/Help.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert } = useMessenger();
const { t } = useI18n();

const name = ref({ ...config.value?.name });
const description = ref({ ...config.value?.description });
const format = ref(config.value?.format || FORMATS_EXT[0]);
const textAnnotation = ref(config.value?.textAnnotation);
const sentenceSegmenter = ref(config.value?.sentenceSegmenter || "");
const datetimeFrom = ref(config.value?.datetimeFrom);
const datetimeTo = ref(config.value?.datetimeTo);

const fileFormatOptions = computed(() =>
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
    { none: t("none") }
  )
);

async function save() {
  const corpusIdFixed = corpusId;
  const configNew = {
    name: name.value,
    description: description.value,
    format: format.value,
    textAnnotation: textAnnotation.value,
    sentenceSegmenter: sentenceSegmenter.value,
    datetimeFrom: datetimeFrom.value,
    datetimeTo: datetimeTo.value,
  };
  try {
    await uploadConfig(configNew, corpusIdFixed);
    router.push(`/corpus/${corpusIdFixed}`);
  } catch (e) {
    alert(e, "error");
  }
}
</script>

<style></style>
