<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { FormKit } from "@formkit/vue";
import { cloneDeep, groupBy, uniqBy } from "es-toolkit";
import Yaml from "js-yaml";
import { watchImmediate } from "@vueuse/core";
import { PhTrash } from "@phosphor-icons/vue";
import AnnotationAnnotator from "./AnnotationAnnotator.vue";
import CustomAnnotator from "./CustomAnnotator.vue";
import ParameterField from "./ParameterField.vue";
import ConfigField from "./ConfigField.vue";
import * as A from "./annotators.types";
import {
  annotationOptions,
  data,
  decorateConfig,
  findAnnotationDefs,
  getCustom,
  type Custom,
  type CustomObject,
  type DecoratedConfig,
} from "./annotators";
import LayoutBox from "@/components/LayoutBox.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import TextData from "@/components/TextData.vue";
import ActionButton from "@/components/ActionButton.vue";
import { randomString } from "@/util";

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

/** Ids of annotations marked as selected. */
const selectedAnnotations = reactive<string[]>([]);

/** Wildcard names (`{...}`) extracted from each selected annotations. */
const wildcards = computed<Record<string, string[]>>(() =>
  Object.fromEntries(
    selectedAnnotations
      .map((annotation) => [
        annotation,
        [...annotation.matchAll(/\{([^}]+)\}/g).map((a) => a[1])],
      ])
      .filter(([, names]) => names.length > 0),
  ),
);

/** User-input values to the wildcards of each annotation. Maintained by a watcher. */
const wildcardValues = reactive<Record<string, Record<string, string>>>({});

watchImmediate(wildcards, () => {
  // Initialize new values to undefined
  for (const annotation in wildcards.value) {
    wildcardValues[annotation] ??= {};
    for (const name of wildcards.value[annotation]) {
      wildcardValues[annotation][name] ??= "";
    }
  }
  // Remove old values
  for (const annotation in wildcardValues) {
    if (!wildcards.value[annotation]) {
      delete wildcardValues[annotation];
    }
  }
});

// TODO Optionally rename output with `as {name}`

/** Configuration objects with user inputs for each added custom annotation. */
const selectedCustom = reactive<CustomObject[]>([]);

/** Configuration objects of the selected annotations. */
const selectedConfigs = computed<DecoratedConfig[]>(() => {
  const annotationDefs = selectedAnnotations.flatMap(findAnnotationDefs);
  const configs = annotationDefs.flatMap(({ config }) =>
    config ? Object.values(decorateConfig(config)) : [],
  );
  return uniqBy(configs, (c) => `${c._namespace}.${c._name}`);
});

/** Find the configuration object having the specified namespace and name. */
const findConfig = (namespace: string, name: string) =>
  selectedConfigs.value.find(
    (c) => c._namespace == namespace && c._name == name,
  );

/** User input of annotation configuration objects, keyed by namespace and name of the annotation. Maintained by a watcher. */
const configValues = reactive<Record<string, Record<string, unknown>>>({});

watchImmediate(selectedConfigs, () => {
  // Initialize new values to undefined
  for (const config of selectedConfigs.value) {
    configValues[config._namespace] ??= {};
    configValues[config._namespace][config._name] ??= undefined;
  }
  // Remove old values
  for (const namespace in configValues) {
    for (const name in configValues[namespace]) {
      const config = findConfig(namespace, name);
      if (!config) delete configValues[namespace][name];
    }
    if (!Object.keys(configValues[namespace]).length) {
      delete configValues[namespace];
    }
  }
});

/** Partial Sparv config as YAML text. */
const configOutput = computed<string>(() => {
  const annotations = selectedAnnotations.map((annotation) => {
    for (const [name, value] of Object.entries(
      wildcardValues[annotation] || {},
    )) {
      annotation = annotation.replace(`{${name}}`, value);
    }
    return annotation;
  });
  const customAnnotations = selectedCustom.map((c) => ({
    annotator: `${c.moduleName}:${c.functionName}`,
    parameters: c.parameters,
  }));

  const values = cloneDeep(configValues);
  // Remove unchanged entries
  for (const namespace in values) {
    for (const name in values[namespace]) {
      // TODO Differentiate between empty string and null
      const value = values[namespace][name];
      const config = findConfig(namespace, name)!;
      const hasChanged =
        value !== undefined && value !== "" && value != config.default;
      if (!hasChanged) delete values[namespace][name];
    }
    const isEmpty = Object.keys(values[namespace]).length === 0;
    if (isEmpty) delete values[namespace];
  }

  const configData = {
    export: {
      annotations,
    },
    custom_annotations: customAnnotations,
    ...values,
  };
  return Yaml.dump(configData);
});

/** Add or remove a given annotation. */
function toggleAnnotation(annotation: string) {
  const index = selectedAnnotations.indexOf(annotation);
  if (index === -1) selectedAnnotations.push(annotation);
  else selectedAnnotations.splice(index, 1);
}

/** Add a custom annotation. */
function addCustom(name: string) {
  const [moduleName, functionName] = name.split(":");
  const annotator = data[moduleName].functions[functionName];
  if (!A.isCustom(annotator)) return; // For type inference.
  const parameters = Object.fromEntries(
    Object.keys(annotator.parameters).map((key) => [key, undefined]),
  );
  const id = randomString();
  selectedCustom.push({ id, moduleName, functionName, parameters, annotator });
}

/** Remove a custom annotation. */
function removeCustom(id: string) {
  const i = selectedCustom.findIndex((c) => c.id == id);
  if (i == -1) return;
  selectedCustom.splice(i, 1);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormKitWrapper>
      <div class="xl:flex gap-4">
        <LayoutBox title="Annotators" collapsible class="xl:flex-1">
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
                @toggle="toggleAnnotation"
              />

              <CustomAnnotator
                v-if="a.type == 'custom'"
                :id="`${a.module}:${a.func}`"
                :func="a.func"
                :description="a.funcDef.description"
                :selected="
                  !!selectedCustom.find(
                    (c) => c.moduleName == a.module && c.functionName == a.func,
                  )
                "
                @add="addCustom"
              />
            </div>
          </details>
        </LayoutBox>

        <div class="xl:flex-1 flex flex-col gap-4">
          <LayoutBox
            title="Annotation wildcards"
            :collapsible="!!Object.keys(wildcardValues).length"
          >
            <details
              v-for="(values, annotation) in wildcardValues"
              :key="annotation"
              open
            >
              <summary>
                <code>{{ annotation }}</code>
              </summary>

              <div class="flex flex-wrap gap-x-4">
                <FormKit
                  v-for="(value, name) in values"
                  :key="name"
                  type="text"
                  :label="name"
                  v-model="wildcardValues[annotation][name]"
                  validation="required"
                />
              </div>
            </details>
          </LayoutBox>

          <LayoutBox
            title="Analysis settings"
            :collapsible="!!selectedConfigs.length"
          >
            <details
              v-for="(group, namespace) in groupBy(
                selectedConfigs,
                (config) => config._namespace,
              )"
              :key="namespace"
              open
              class="my-4"
            >
              <summary>
                <code>{{ namespace }}</code>
              </summary>

              <ConfigField
                v-for="config in group"
                :key="config._name"
                v-model="configValues[namespace][config._name]"
                :name="config._name"
                :description="config.description"
                :datatype="config.datatype"
                :defaultValue="config.default"
                :choices="config.choices"
              />
            </details>
          </LayoutBox>

          <LayoutBox
            title="Custom annotations"
            :collapsible="!!selectedCustom.length"
          >
            <details
              v-for="{
                id,
                moduleName,
                functionName,
                annotator,
                parameters,
              } in selectedCustom"
              :key="id"
              open
              class="my-4"
            >
              <summary>
                <code>{{ moduleName }}</code> –
                <code>{{ functionName }}</code> –
                {{ annotator.description }}
              </summary>

              <ActionButton @click="removeCustom(id)" class="button-danger">
                <PhTrash class="inline" />
                {{ $t("delete") }}
              </ActionButton>

              <div class="flex flex-wrap gap-x-4">
                <ParameterField
                  v-for="(parameter, name) in annotator.parameters"
                  :key="name"
                  :type="parameter.type"
                  :name="String(name)"
                  :optional="parameter.optional"
                  :defaultValue="parameter.default"
                  v-model="parameters[name]"
                />
              </div>
            </details>
          </LayoutBox>
        </div>
      </div>

      <LayoutBox title="Config">
        <TextData :text="configOutput" language="yaml" />
      </LayoutBox>
    </FormKitWrapper>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
::v-deep(code:not(.hljs)) {
  font-size: smaller;
}
details {
  padding-inline-start: 1rem;
}
summary {
  text-indent: -1rem;
  cursor: pointer;
}
</style>
