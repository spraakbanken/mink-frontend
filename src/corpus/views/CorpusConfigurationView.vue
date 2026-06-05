<script setup lang="ts">
import type { FormKitOptionsList } from "@formkit/inputs";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import { PhLightbulbFilament, PhTrash } from "@phosphor-icons/vue";
import { computedAsync, watchImmediate } from "@vueuse/core";
import { omit, pickBy } from "es-toolkit";
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
import { fromKeys, type ByLang } from "@/util";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useLocale from "@/i18n/locale.composable";
import TabsBar from "@/components/TabsBar.vue";
import TabsContent from "@/components/TabsContent.vue";
import useSources from "@/resource/sources.composable";
import { CORPUS_SOURCE_FORMATS } from "@/file";
import { useUserStore } from "@/store/user.store";
import { useSparvAnalyses } from "@/api/useSparvAnalyses";
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
  analyses: Record<string, boolean>;
};

const { appConfig } = useAppConfig();
const router = useRouter();
const id = useResourceIdParam();
const api = useApi();
const { config, configOptions, saveConfigOptions } = useCorpus(id);
const { extensions } = useSources("corpus", id);
const { analyses, getAnalysesByAnnotations, getLanguageCode } =
  useSparvAnalyses();
const { showAlert } = useAlert();
const { t } = useI18n();
const { locale3, th, thCompare } = useLocale();
const { canAdmin, canWrite } = useUserStore();

const tabSelected = ref<TabKey>("metadata");

const languages = computedAsync(() => api.sparvLanguages(), []);

const languageOptions = computed(() =>
  languages.value.map(({ code, name, variety }) => ({
    value: getLanguageCode(code, variety),
    label: name,
  })),
);

const selectedLanguage = computed(() => {
  if (!configOptions.value?.language) return appConfig.defaultLanguage;
  return getLanguageCode(
    configOptions.value.language,
    configOptions.value.variety,
  );
});

/** Analyses grouped by language and unit */
const analysisGroups = computed(() => {
  // Require attributive annotations
  const filtered = analyses.value
    .filter((analysis) =>
      analysis.annotations.some((annotation) => annotation.includes(":")),
    )
    .sort(thCompare((x) => x.name));

  // Language codes
  const codes = languageOptions.value.map((l) => l.value);
  // List of recognized units
  const units = ["text", "sentence", "token", "other"];

  // Build two-dimensional listing of analyses by language and unit
  return fromKeys(codes, (code) =>
    fromKeys(units, (unit) =>
      filtered.filter((analysis) => {
        // Match language
        // Sparv handles `language_varieties` separately from `languages`,
        // but we'll assume there is only one variety if any.
        const variety = analysis.language_varieties?.[0];
        const matchesLanguage =
          !analysis.languages ||
          analysis.languages.find(
            (l) => getLanguageCode(l.code, variety) == code,
          );
        if (!matchesLanguage) return false;
        // Match unit
        const unitRaw = analysis.analysis_unit?.eng || "";
        const thisUnit = units.includes(unitRaw) ? unitRaw : "other";
        return thisUnit == unit;
      }),
    ),
  );
});

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

  // Split language-variety code
  const [language, variety] = fields.language.split("-");

  // Use datetime if both are set
  const datetime =
    fields.datetimeFrom && fields.datetimeTo
      ? { from: fields.datetimeFrom, to: fields.datetimeTo }
      : undefined;

  const analysisIds = Object.keys(pickBy(fields.analyses, Boolean));
  const annotations = analyses.value
    .filter((a) => analysisIds.includes(a.id))
    .flatMap((a) => a.annotations);

  const configNew: ConfigOptions = {
    ...omit(fields, ["datetimeFrom", "datetimeTo"]),
    language,
    variety,
    datetime,
    annotations,
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

          <PendingContent on="sparv/analyses">
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
                :value="selectedLanguage"
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
                    <tr v-if="!group.length">
                      <td colspan="3" class="py-1 italic">
                        {{ $t("config.analyses.available.none") }}
                      </td>
                    </tr>
                    <tr v-for="analysis in group" :key="analysis.id">
                      <td class="py-1">
                        <FormKit
                          :name="analysis.id"
                          :label="th(analysis.name)"
                          :value="
                            getAnalysesByAnnotations(
                              original.annotations,
                            ).includes(analysis)
                          "
                          type="checkbox"
                          :help="th(analysis.short_description)"
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
