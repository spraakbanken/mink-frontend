<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { capitalize, isEqual, pickBy } from "es-toolkit";
import { FormKit } from "@formkit/vue";
import { useSparv } from "./sparv.composable";
import useLocale from "@/i18n/locale.composable";
import { fromKeys } from "@/util";

const props = defineProps<{
  langkey: string;
}>();

const model = defineModel<string[]>({ required: true });

const { findAnalyses, groupAnalyses } = useSparv();
const { th, thCompare } = useLocale();

/** Local model: map of ids to boolean, matching the FormKit structure */
const selection = ref<Record<string, boolean>>(
  fromKeys(model.value, () => true),
);

// Sync external list model to local map model
watch(model, () => {
  const selectionNew = fromKeys(model.value, () => true);
  const selectionOld = pickBy(selection.value, Boolean);
  if (!isEqual(selectionOld, selectionNew)) selection.value = selectionNew;
});

// Sync local map model to external list model
watch(selection, () => {
  const modelNew = Object.keys(pickBy(selection.value, Boolean));
  if (!isEqual(model.value, modelNew)) model.value = modelNew;
});

/** Analyses for the selected language */
const analysesGrouped = computedAsync(async () => {
  const [language, variety] = props.langkey.split("-") || [];
  const analyses = await findAnalyses({ language, variety });
  const sorted = analyses
    .sort(thCompare((x) => x.name))
    .sort(thCompare((x) => x.task));
  const grouped = groupAnalyses(sorted);
  return grouped;
});

const isEmpty = computed(() =>
  Object.values(analysesGrouped.value || {}).every(
    (analyses) => !analyses.length,
  ),
);
</script>

<template>
  <FormKit type="group" name="analyses" v-model="selection">
    <template v-for="(analyses, unit) in analysesGrouped" :key="unit">
      <section v-if="analyses.length">
        <h3 class="text-xl mt-2 font-heading">
          {{ $t(`config.analyses.unit.${unit}`) }}
        </h3>

        <FormKit
          v-for="analysis in analyses"
          :key="analysis.id"
          :name="analysis.id"
          :value="selection[analysis.id]"
          type="checkbox"
          :help="th(analysis.short_description)"
          outer-class="my-1"
        >
          <template #label>
            <span class="formkit-label"
              >{{ capitalize(th(analysis.task)!) }}:</span
            >
            {{ th(analysis.name) }}
          </template>
          <template #help>
            <div class="formkit-help">
              <div>
                {{ th(analysis.short_description) }}
                <a
                  v-if="$t('config.analyses.url')"
                  :href="$t('config.analyses.url', { id: analysis.id })"
                  target="_blank"
                >
                  ({{ $t("more_info") }})
                </a>
              </div>
            </div>
          </template>
        </FormKit>
      </section>
    </template>

    <div v-if="isEmpty" class="italic">
      {{ $t("config.analyses.available.none") }}
    </div>
  </FormKit>
</template>
