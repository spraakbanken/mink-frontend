<script setup lang="ts">
import { computed, ref } from "vue";
import { uniqBy } from "es-toolkit";
import { FormKit } from "@formkit/vue";
import { annotationOptions } from "./annotators";
import CustomAnnotator from "./CustomAnnotator.vue";
import AnnotationAnnotator from "./AnnotationAnnotator.vue";

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

/** Modules having any annotations matching the free-text filter. */
const modulesFiltered = computed(() =>
  uniqBy(annotationsFiltered.value, (a) => a.module),
);
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <FormKit type="text" v-model="filterText" label="Filter" />
  </div>

  <details
    v-for="{ module, moduleDef } in modulesFiltered"
    :key="module"
    class="has-checked:bg-sky-400/10"
    open
  >
    <summary>
      <code>{{ module }}</code> –
      {{ moduleDef.description }}
    </summary>

    <div
      v-for="a in uniqBy(
        annotationsFiltered.filter((a) => a.module == module),
        (a) => a.func,
      )"
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

      <CustomAnnotator
        v-if="a.type == 'custom'"
        :func="a.func"
        :description="a.funcDef.description"
        :selected="
          !!selectedCustom.find(
            (c) => c.moduleName == a.module && c.functionName == a.func,
          )
        "
        @add="$emit('addCustom', `${a.module}:${a.func}`)"
      />
    </div>
  </details>
</template>
