<script setup lang="ts">
import type { FormKitOptionsList } from "@formkit/inputs";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import { PhLightbulbFilament, PhTrash } from "@phosphor-icons/vue";
import { computedAsync, watchImmediate } from "@vueuse/core";
import { groupBy, omit } from "es-toolkit";
import { useCorpus } from "../corpus.composable";
import {
  type ConfigOptions,
  type CorpusSourceFormat,
  SEGMENTERS,
  emptyConfig,
  isSegmentable,
} from "@/api/corpusConfig";
import type { ConfigSentenceSegmenter } from "@/api/sparvConfig.types";
import HelpBox from "@/components/HelpBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import RouteButton from "@/components/RouteButton.vue";
import useAlert from "@/alert/alert.composable";
import PendingContent from "@/spin/PendingContent.vue";
import type { ByLang } from "@/util";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useLocale from "@/i18n/locale.composable";
import TabsBar from "@/components/TabsBar.vue";
import TabsContent from "@/components/TabsContent.vue";
import useSpin from "@/spin/spin.composable";
import useSources from "@/resource/sources.composable";
import { CORPUS_SOURCE_FORMATS } from "@/file";
import { useUserStore } from "@/store/user.store";
import { useAnalysisRegistry } from "@/analyses/useAnalysisRegistry";
import type { Analysis, AnalysisId } from "@/analyses/analyses.types";
import { useApi } from "@/api/useApi";
import { useAppConfig } from "@/app/useAppConfig";

type TabKey = "metadata" | "settings" | "analyses";

type Form = {
  name: ByLang;
  description: ByLang;
  format: CorpusSourceFormat;
  textAnnotation: string;
  language: string;
  sentenceSegmenter: ConfigSentenceSegmenter;
  datetimeFrom: string;
  datetimeTo: string;
  analyses: Record<AnalysisId, boolean>;
};

const { appConfig } = useAppConfig();
const router = useRouter();
const id = useResourceIdParam();
const { config, configOptions, saveConfigOptions } = useCorpus(id);
const { extensions } = useSources("corpus", id);
const analysisRegistry = useAnalysisRegistry();
const api = useApi();
const { showAlert } = useAlert();
const { t } = useI18n();
const { locale3, th, thCompare } = useLocale();
const { spin } = useSpin();
const { canAdmin, canWrite } = useUserStore();

const tabSelected = ref<TabKey>("metadata");

const languages = computedAsync(() => api.sparvLanguages(), []);

const languageOptions = computed(() =>
  languages.value.map(({ code, name }) => ({
    value: code,
    label: `${name} (${code})`,
  })),
);

/** List of metadata for relevant analyses */
const analyses = computedAsync<Analysis[]>(async () => {
  const analyses =
    (await spin(analysisRegistry.loadMetadata(), "analysis/metadata").catch(
      showAlert,
    )) || [];

  // Skip analyses that do not have annotations
  return analyses
    .filter((analysis) => analysisRegistry.getAnnotations([analysis.id]).length)
    .sort(thCompare((x) => x.label));
});

/** Analyses grouped by language and unit */
const analysisGroups = computed<Record<string, Record<string, Analysis[]>>>(
  () =>
    Object.fromEntries(
      languages.value.map((language) => {
        const filtered = (analyses.value || []).filter(
          (a) => !a.languages || a.languages?.includes(language.code),
        );

        // Group by unit: text, token or other
        const groups = groupBy(filtered, (analysis) => {
          const unit =
            typeof analysis.unit == "object" ? analysis.unit.eng : "";
          if (unit == "text" || unit == "token") return unit;
          return "other";
        });

        return [language.code, groups];
      }),
    ),
);

const formatOptions = computed<FormKitOptionsList>(() =>
  CORPUS_SOURCE_FORMATS.map((ext) => ({
    value: ext,
    label: `${t(ext)} (.${ext})`,
    // If there are source files, disable all formats not present there.
    attrs: {
      disabled: extensions.value.length > 0 && !extensions.value.includes(ext),
    },
  })),
);

// Auto-select the file format present among source files, if any.
const selectedFormat = computed<CorpusSourceFormat | undefined>(() =>
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

/** Original values from the current config, or defaults if not loaded or parsing failed */
const original = computed(() => configOptions.value || emptyConfig());

// Alert if parsing fails
watchImmediate(configOptions, () => {
  if (configOptions.value === null) showAlert(t("corpus.config.parse.error"));
});

async function submit(fields: Form) {
  const configOld = original.value;

  // Use datetime if both are set
  const datetime =
    fields.datetimeFrom && fields.datetimeTo
      ? { from: fields.datetimeFrom, to: fields.datetimeTo }
      : undefined;

  const configNew: ConfigOptions = {
    ...omit(fields, ["datetimeFrom", "datetimeTo"]),
    datetime,
  };

  // Preserve hidden translations
  configNew.name = { ...configOld.name, ...configNew.name };
  configNew.description = {
    ...configOld.description,
    ...configNew.description,
  };

  // Merge new form values with existing config.
  const config = { ...configOld, ...configNew };

  try {
    await saveConfigOptions(config);
    router.push(`/library/corpus/${id}`);
  } catch (e) {
    showAlert(e);
  }
}
</script>

<template>
  <PendingContent :on="`${id}/config`">
    <LayoutSection :title="$t('configuration')">
      <TabsBar
        :tabs="[
          { key: 'metadata', label: $t('config.metadata') },
          { key: 'settings', label: $t('settings') },
          { key: 'analyses', label: $t('config.analyses') },
        ]"
        v-model="tabSelected"
      />

      <!-- Using the key attribute to re-render whole form after fetching config -->
      <FormKitWrapper v-if="configOptions !== undefined" :key="config">
        <FormKit
          id="corpus-config"
          v-slot="{ value }"
          type="form"
          :disabled="!canWrite('corpus', id)"
          :submit-label="$t('save')"
          :submit-attrs="{
            inputClass: 'mink-button button-primary',
          }"
          @submit="submit"
        >
          <TabsContent
            v-show="tabSelected == 'metadata'"
            :title="$t('metadata')"
          >
            <HelpBox>
              <p>{{ $t("config.metadata.help") }}</p>
            </HelpBox>

            <!-- Use current UI language, so if it's "swe", show input for `name.swe` etc -->
            <!-- TODO Manage current input if user switches locale while editing -->
            <FormKit type="group" name="name">
              <FormKit
                :name="locale3"
                :label="$t('name')"
                :value="original.name?.[locale3]"
                :help="$t('metadata.name.help')"
                type="text"
                input-class="w-72"
              />
            </FormKit>

            <FormKit type="group" name="description">
              <FormKit
                :name="locale3"
                :label="$t('description')"
                :value="original.description?.[locale3]"
                :help="$t('metadata.description.help')"
                type="textarea"
                input-class="w-full h-20"
              />
            </FormKit>

            <FormKit
              :label="$t('identifier')"
              type="text"
              name="identifier"
              disabled
              :value="id"
              :help="$t('metadata.identifier.help')"
            >
              <template #label>
                <!-- Avoid orphaned <label> for better accessibility -->
                <span class="formkit-label">{{ $t("identifier") }}</span>
              </template>
              <template #input>
                <TerminalOutput class="inline leading-loose">
                  {{ id }}
                </TerminalOutput>
              </template>
            </FormKit>
          </TabsContent>

          <TabsContent
            v-show="tabSelected == 'settings'"
            :title="$t('settings')"
          >
            <HelpBox>
              <p>{{ $t("config.configuration.help") }}</p>
            </HelpBox>

            <FormKit
              name="format"
              :label="$t('fileFormat')"
              :value="selectedFormat"
              type="select"
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
              :value="original.textAnnotation"
              validation="required:trim|matches:/^[^<>\s]*$/"
              input-class="w-40 font-mono"
              :help="$t('config.text_annotation.help')"
            >
              <template #prefix> &lt; </template>
              <template #suffix> &gt; </template>
            </FormKit>

            <FormKit
              v-if="isSegmentable((value as Form).format)"
              name="sentenceSegmenter"
              :label="$t('segmenter_sentence')"
              :value="original.sentenceSegmenter || ''"
              type="radio"
              :options="segmenterOptions"
              :help="$t('segmenter_sentence_help')"
            />

            <FormKit
              name="datetimeFrom"
              type="date"
              :label="`${$t('timespan')}: ${$t('timespan_from')}`"
              :value="original.datetime?.from"
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
              :value="original.datetime?.to"
              :min="(value as Form).datetimeFrom"
              validation="onlyif:datetimeFrom"
              :validation-messages="{
                onlyif: $t('config.datetime.validate_both'),
              }"
              :help="$t('timespan_help')"
            />
          </TabsContent>

          <PendingContent on="analysis/metadata">
            <TabsContent
              v-show="tabSelected == 'analyses'"
              :title="$t('config.analyses')"
            >
              <HelpBox>
                <i18n-t keypath="config.analyses.info" scope="global">
                  <template #custom_config>
                    <router-link :to="`/library/corpus/${id}/config/custom`">
                      {{ $t("config.custom") }}
                    </router-link>
                  </template>
                </i18n-t>
              </HelpBox>

              <FormKit
                name="language"
                :label="$t('config.language')"
                type="select"
                :value="configOptions?.language || appConfig.defaultLanguage"
                input-class="w-72"
                :options="languageOptions"
                validation="required"
                :help="$t('config.language.help')"
              />

              <FormKit type="group" name="analyses">
                <table class="my-2">
                  <thead>
                    <tr>
                      <th>{{ $t("description") }}</th>
                      <th>{{ $t("identifier") }}</th>
                      <th>{{ $t("config.analyses.task") }}</th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="(group, unit) in analysisGroups[
                      (value as Form).language
                    ]"
                    :key="unit"
                  >
                    <tr>
                      <th colspan="5" class="text-lg pt-4!">
                        {{ $t("config.analyses.unit") }}:
                        {{ $t(`config.analyses.unit.${unit}`) }}
                      </th>
                    </tr>
                    <tr v-for="analysis in group" :key="analysis.id">
                      <td class="py-1">
                        <FormKit
                          :name="analysis.id"
                          :label="th(analysis.label)"
                          :value="original.analyses[analysis.id]"
                          type="checkbox"
                          :help="th(analysis.summary)"
                        />
                      </td>
                      <td>
                        <a
                          :href="$t('config.analyses.url', [analysis.id])"
                          target="_blank"
                        >
                          {{ analysis.id }}
                        </a>
                      </td>
                      <td>{{ th(analysis.task) }}</td>
                    </tr>
                  </tbody>
                  <tbody
                    v-if="!analysisGroups[(value as Form).language]?.length"
                  >
                    <tr>
                      <td colspan="3" class="italic">
                        {{ $t("config.analyses.none") }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </FormKit>
            </TabsContent>
          </PendingContent>
        </FormKit>
      </FormKitWrapper>

      <div class="flex justify-center items-baseline gap-4">
        <router-link :to="`/library/corpus/${id}/config/custom`">
          {{ $t("config.custom") }}
        </router-link>

        <RouteButton
          :disabled="!canAdmin('corpus', id)"
          :to="`/library/corpus/${id}/delete`"
          class="button-danger"
        >
          <PhTrash weight="fill" class="inline mb-1 mr-1" />
          {{ $t("delete") }}
        </RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
