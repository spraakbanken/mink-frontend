<script setup lang="ts">
import type { FormKitOptionsList } from "@formkit/inputs";
import type { AxiosError } from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import { PhLightbulbFilament, PhTrash } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
import { groupBy } from "es-toolkit";
import { useCorpus } from "../corpus.composable";
import type { MinkResponse } from "@/api/api.types";
import {
  type ConfigOptions,
  FORMATS_EXT,
  type FileFormat,
  SEGMENTERS,
  emptyConfig,
  parseConfig,
} from "@/api/corpusConfig";
import type { ConfigSentenceSegmenter } from "@/api/sparvConfig.types";
import HelpBox from "@/components/HelpBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import RouteButton from "@/components/RouteButton.vue";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import type { ByLang } from "@/util.types";
import LayoutBox from "@/components/LayoutBox.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import {
  analysisAnnotations,
  loadAnalysisMetadata,
  type AnalysisId,
} from "@/api/analysis";
import useLocale from "@/i18n/locale.composable";
import TabsBar from "@/components/TabsBar.vue";
import TabsContent from "@/components/TabsContent.vue";

type TabKey = "metadata" | "settings" | "analyses";

type Form = {
  name: ByLang;
  description: ByLang;
  format: FileFormat;
  textAnnotation: string;
  sentenceSegmenter: ConfigSentenceSegmenter;
  datetimeFrom: string;
  datetimeTo: string;
  analyses: Record<AnalysisId, boolean>;
};

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, saveConfigOptions, extensions } = useCorpus(corpusId);
const { alert, alertError } = useMessenger();
const { t } = useI18n();
const { th, thCompare } = useLocale();

const tabSelected = ref<TabKey>("metadata");

/** List of metadata for relevant analyses */
const analyses = computedAsync(async () => {
  const analyses = await loadAnalysisMetadata();
  // Skip analyses that do not have annotations
  // Sort by most significant property last
  const filtered = analyses
    .filter((analysis) => analysisAnnotations[analysis.id])
    .sort(thCompare((x) => x.name))
    .sort(thCompare((x) => x.analysis_unit));

  // Group by unit: text, token or other
  return groupBy(filtered, (analysis) => {
    const unit = analysis.analysis_unit?.eng;
    if (unit == "text" || unit == "token") return unit;
    return "other";
  });
});

const configOptions = computed(getParsedConfig);

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
  configOptions.value?.format &&
  (!extensions.value.length ||
    extensions.value.includes(configOptions.value?.format))
    ? configOptions.value?.format
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

// Like `getParsedConfig` in `corpus.composable.ts` but also alerts on error.
function getParsedConfig() {
  if (!config.value) return undefined;
  try {
    const parsed = parseConfig(config.value);
    return parsed;
  } catch (error) {
    alert(t("corpus.config.parse.error"), "error");
    console.error(`Error parsing config for "${corpusId}":`, error);
  }
}

async function submit(fields: Form) {
  // If there is no previous config file, start from a minimal one.
  const configOld = configOptions.value || emptyConfig();

  // Merge new form values with existing config.
  const configNew: ConfigOptions = {
    ...configOld,
    name: fields.name,
    description: fields.description,
    format: fields.format,
    textAnnotation: fields.textAnnotation,
    sentenceSegmenter: fields.sentenceSegmenter,
    datetime:
      fields.datetimeFrom && fields.datetimeTo
        ? {
            from: fields.datetimeFrom,
            to: fields.datetimeTo,
          }
        : undefined,
    analyses: { ...fields.analyses },
  };

  try {
    await saveConfigOptions(configNew);
    router.push(`/library/corpus/${corpusId}`);
  } catch (e) {
    if (e instanceof TypeError) {
      // Error from config serialization
      alert(e.message, "error");
    } else alertError(e as AxiosError<MinkResponse>);
  }
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <LayoutSection :title="$t('configuration')">
      <TabsBar
        :tabs="[
          { key: 'metadata', label: $t('metadata') },
          { key: 'settings', label: $t('settings') },
          { key: 'analyses', label: $t('config.analyses') },
        ]"
        v-model="tabSelected"
      />

      <!-- Using the key attribute to re-render whole form after fetching config -->
      <FormKitWrapper v-if="configOptions" :key="config">
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
          <TabsContent
            :title="$t('metadata')"
            v-show="tabSelected == 'metadata'"
          >
            <HelpBox>
              <p>{{ $t("config.metadata.help") }}</p>
            </HelpBox>

            <div class="grid md:grid-cols-2 gap-4">
              <LayoutBox
                v-for="(lang2, lang3) of { swe: 'sv', eng: 'en' }"
                :key="lang3"
                :title="$t(lang2)"
              >
                <FormKit type="group" name="name">
                  <FormKit
                    :name="lang3"
                    :label="$t('name')"
                    :value="configOptions.name?.[lang3]"
                    :help="$t('metadata.name.help')"
                    type="text"
                    input-class="w-72"
                  />
                </FormKit>

                <FormKit type="group" name="description">
                  <FormKit
                    :name="lang3"
                    :label="$t('description')"
                    :value="configOptions.description?.[lang3]"
                    :help="$t('metadata.description.help')"
                    type="textarea"
                    input-class="w-full h-20"
                  />
                </FormKit>
              </LayoutBox>
            </div>

            <FormKit
              :label="$t('identifier')"
              type="text"
              name="identifier"
              disabled
              :value="corpusId"
              :help="$t('metadata.identifier.help')"
            >
              <template #label>
                <!-- Avoid orphaned <label> for better accessibility -->
                <span class="formkit-label">{{ $t("identifier") }}</span>
              </template>
              <template #input>
                <TerminalOutput class="inline leading-loose">
                  {{ corpusId }}
                </TerminalOutput>
              </template>
            </FormKit>
          </TabsContent>

          <TabsContent
            :title="$t('settings')"
            v-show="tabSelected == 'settings'"
          >
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
              <PhLightbulbFilament weight="bold" class="inline mb-1 mr-1" />
              {{ $t("config.format.note.pdf") }}
            </HelpBox>

            <FormKit
              v-if="value!.format === 'xml'"
              name="textAnnotation"
              :label="$t('config.text_annotation')"
              type="text"
              :value="configOptions.textAnnotation"
              validation="required:trim|matches:/^[^<>\s]*$/"
              input-class="w-40 font-mono"
              :help="$t('config.text_annotation.help')"
            >
              <template #prefix> &lt; </template>
              <template #suffix> &gt; </template>
            </FormKit>

            <FormKit
              v-if="!['mp3', 'ogg', 'wav'].includes((value as Form).format)"
              name="sentenceSegmenter"
              :label="$t('segmenter_sentence')"
              :value="configOptions.sentenceSegmenter || ''"
              type="radio"
              :options="segmenterOptions"
              :help="$t('segmenter_sentence_help')"
            />

            <FormKit
              name="datetimeFrom"
              type="date"
              :label="`${$t('timespan')}: ${$t('timespan_from')}`"
              :value="configOptions.datetime?.from"
              :max="(value as Form).datetimeTo"
              validation="onlyif:datetimeTo"
              :validation-messages="{
                onlyif: $t('config.datetime.validate_both'),
              }"
            />
            <FormKit
              name="datetimeTo"
              type="date"
              :label="`${$t('timespan')}: ${$t('timespan_to')}`"
              :value="configOptions.datetime?.to"
              :min="(value as Form).datetimeFrom"
              validation="onlyif:datetimeFrom"
              :validation-messages="{
                onlyif: $t('config.datetime.validate_both'),
              }"
              :help="$t('timespan_help')"
            />
          </TabsContent>

          <TabsContent
            :title="$t('config.analyses')"
            v-show="tabSelected == 'analyses'"
          >
            <HelpBox>
              <i18n-t keypath="config.analyses.info" scope="global">
                <template #custom_config>
                  <router-link
                    :to="`/library/corpus/${corpusId}/config/custom`"
                  >
                    {{ $t("config.custom") }}
                  </router-link>
                </template>
              </i18n-t>
            </HelpBox>

            <FormKit type="group" name="analyses">
              <table class="my-2 striped">
                <thead>
                  <tr>
                    <th>{{ $t("description") }}</th>
                    <th>{{ $t("identifier") }}</th>
                    <th>{{ $t("config.analyses.task") }}</th>
                  </tr>
                </thead>
                <tbody v-for="(group, unit) in analyses" :key="unit">
                  <tr>
                    <th colspan="5" class="text-lg pt-4!">
                      {{ $t("config.analyses.unit") }}:
                      {{ $t(`config.analyses.unit.${unit}`) }}
                    </th>
                  </tr>
                  <tr v-for="analysis in group" :key="analysis.id">
                    <td>
                      <FormKit
                        :name="analysis.id"
                        :label="th(analysis.name)"
                        :value="configOptions.analyses[analysis.id]"
                        type="checkbox"
                        :help="th(analysis.short_description)"
                      />
                    </td>
                    <td>
                      <a
                        :href="$t('config.analyses.url', [analysis.id])"
                        target="_blank"
                        class="whitespace-nowrap"
                      >
                        {{ analysis.id }}
                      </a>
                    </td>
                    <td>{{ th(analysis.task) }}</td>
                  </tr>
                </tbody>
              </table>
            </FormKit>
          </TabsContent>
        </FormKit>
      </FormKitWrapper>

      <div class="flex justify-center items-baseline gap-4">
        <RouteButton :to="`/library/corpus/${corpusId}/config/custom`">
          {{ $t("config.custom") }}
        </RouteButton>

        <RouteButton
          :to="`/library/corpus/${corpusId}/delete`"
          class="button-danger"
        >
          <PhTrash weight="fill" class="inline mb-1 mr-1" />
          {{ $t("corpus.delete") }}
        </RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
