<script setup lang="ts">
import { computed, ref } from "vue";
import { groupBy, mapValues } from "es-toolkit";
import { FormKit } from "@formkit/vue";
import { annotationOptions } from "./annotators";
import CustomAnnotator from "./CustomAnnotator.vue";
import AnnotationAnnotator from "./AnnotationAnnotator.vue";
import * as A from "./annotators.types";

defineProps<{
  selectedAnnotations: string[];
  selectedCustom: { moduleName: string; functionName: string }[];
}>();

defineEmits<{
  (e: "toggleAnnotation", id: string): void;
  (e: "addCustom", id: string): void;
}>();

/** User input to the free-text listing filter. */
const filterText = ref("");

/** Annotations matching the free-text filter. */
const annotationsFiltered = computed(() =>
  annotationOptions.filter((a) => {
    const strs = [
      a.module,
      a.moduleDef.description,
      a.func,
      a.funcDef.description,
    ];
    if ("annotation" in a) strs.push(a.annotation, a.annotationDef.description);
    const words = filterText.value.split(/\s+/);
    return words.every((word) =>
      strs.some((s) => s.toLowerCase().includes(word.toLowerCase())),
    );
  }),
);

/** Filtered annotations grouped by module and function name.*/
const annotationsFilteredGrouped = computed(() =>
  mapValues(
    groupBy(annotationsFiltered.value, (a) => a.module),
    (as) => groupBy(as, (a) => a.func),
  ),
);
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <FormKit type="text" v-model="filterText" label="Filter" />
  </div>

  <details
    v-for="(annotationsByFunction, module) in annotationsFilteredGrouped"
    :key="module"
    class="not-open:has-checked:bg-sky-400/10 mb-4"
    open
  >
    <summary>
      <code>{{ module }}</code> –
      {{ Object.values(annotationsByFunction)[0][0].moduleDef.description }}
    </summary>

    <template v-for="(annotations, func) in annotationsByFunction" :key="func">
      <details
        v-if="A.isAnalysis(annotations[0].funcDef)"
        class="not-open:has-checked:bg-sky-400/10"
        open
      >
        <summary>
          <code>{{ func }}</code> –
          {{ annotations[0].funcDef.descriptionShort }}
        </summary>

        <div
          v-if="annotations[0].funcDef.descriptionRest"
          class="text-sm opacity-80 whitespace-break-spaces"
        >
          {{ annotations[0].funcDef.descriptionRest.replace(/\n\n/g, "\n") }}
        </div>

        <div
          v-for="a in annotations"
          :key="a.key"
          class="has-checked:bg-sky-400/10"
        >
          <AnnotationAnnotator
            v-if="a.type == 'annotation'"
            :id="a.annotation"
            :description="a.annotationDef.description"
            :selected="selectedAnnotations.includes(a.annotation)"
            @toggle="$emit('toggleAnnotation', a.annotation)"
          />
        </div>
      </details>

      <CustomAnnotator
        v-else
        :func="annotations[0].func"
        :description="annotations[0].funcDef.description"
        :selected="
          !!selectedCustom.find(
            (c) =>
              c.moduleName == annotations[0].module &&
              c.functionName == annotations[0].func,
          )
        "
        @add="
          $emit('addCustom', `${annotations[0].module}:${annotations[0].func}`)
        "
      />
    </template>
  </details>
</template>
