<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { FormKit } from "@formkit/vue";
import { PhPlusSquare } from "@phosphor-icons/vue";
import { cloneDeep, uniq, uniqBy } from "es-toolkit";
import Yaml from "js-yaml";
import { watchImmediate } from "@vueuse/core";
import * as A from "./annotators.types";
import LayoutBox from "./components/LayoutBox.vue";
import FormKitWrapper from "./components/FormKitWrapper.vue";
import TextData from "./components/TextData.vue";
import annotatorsFile from "@/assets/annotators.json";

const data = (annotatorsFile as unknown as A.File).annotators;

const annotations = Object.fromEntries(
  Object.entries(data).map(([module, moduleDef]) => [
    module,
    Object.fromEntries(
      Object.values(moduleDef.functions).flatMap((funcDef) =>
        A.isAnalysis(funcDef) ? Object.entries(funcDef.annotations) : [],
      ),
    ),
  ]),
);

const getAnalysis = (moduleName: string, functionName: string): A.Analysis => {
  const annotator = data[moduleName].functions[functionName];
  if (!A.isAnalysis(annotator)) throw new Error("Not an analysis");
  return annotator;
};

const getCustom = (moduleName: string, functionName: string): A.Custom => {
  const annotator = data[moduleName].functions[functionName];
  if (!A.isCustom(annotator)) throw new Error("Not a custom annotator");
  return annotator;
};

const selectedAnnotations = reactive<string[]>([
  "{child}:misc.inherit_{parent}_{attr}",
]);

function findFunctions(annotation: string) {
  const found: [string, string][] = [];
  for (const module in data) {
    const functions = data[module].functions;
    for (const func in functions) {
      if (A.isAnalysis(functions[func])) {
        if (functions[func].annotations[annotation]) found.push([module, func]);
      }
    }
  }
  return found;
}

function findAnnotationDefs(annotation: string) {
  return findFunctions(annotation).flatMap(([module, func]) =>
    getAnalysis(module, func),
  );
}

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

type Custom = { annotator: string; parameters: Record<string, unknown> };
const selectedCustom = ref<Custom[]>([]);
const selectedCustomObjects = computed(() =>
  selectedCustom.value.map(({ annotator: name, parameters }) => {
    const [moduleName, functionName] = name.split(":");
    const annotator = getCustom(moduleName, functionName);
    return { moduleName, functionName, parameters, annotator };
  }),
);

const selectedConfigs = computed<DecoratedConfig[]>(() => {
  const annotationDefs = selectedAnnotations.flatMap(findAnnotationDefs);
  const configs = annotationDefs.flatMap(({ config }) =>
    config ? Object.values(decorateConfig(config)) : [],
  );
  return uniqBy(configs, (c) => `${c._namespace}.${c._name}`);
});

const findConfig = (namespace: string, name: string) =>
  selectedConfigs.value.find(
    (c) => c._namespace == namespace && c._name == name,
  );

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

const configOutput = computed<string>(() => {
  const annotations = selectedAnnotations.map((annotation) => {
    for (const [name, value] of Object.entries(
      wildcardValues[annotation] || {},
    )) {
      annotation = annotation.replace(`{${name}}`, value);
    }
    return annotation;
  });
  const customAnnotations = selectedCustomObjects.value.map((c) => ({
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

function toggleAnnotation(annotation: string) {
  const index = selectedAnnotations.indexOf(annotation);
  if (index === -1) selectedAnnotations.push(annotation);
  else selectedAnnotations.splice(index, 1);
}

function addCustom(name: string) {
  const [moduleName, functionName] = name.split(":");
  const annotator = data[moduleName].functions[functionName];
  if (!A.isCustom(annotator)) return; // For type inference.
  const parameters = Object.fromEntries(
    Object.keys(annotator.parameters).map((key) => [key, undefined]),
  );
  selectedCustom.value.push({ annotator: name, parameters });
}

type DecoratedConfig = A.Config & { _namespace: string; _name: string };
function decorateConfig(
  configMap: Record<string, A.Config>,
): Record<string, DecoratedConfig> {
  const decorated: Record<string, DecoratedConfig> = {};
  for (const name in configMap) {
    const [_namespace, _name] = name.split(".");
    decorated[name] = { ...configMap[name], _namespace, _name };
  }
  return decorated;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormKitWrapper>
      <LayoutBox title="Annotators" collapsible>
        <details
          v-for="(module, moduleName) in data"
          :key="moduleName"
          class="has-checked:bg-sky-400/10"
        >
          <summary>
            <code>{{ moduleName }}</code> –
            {{ module.description }}
          </summary>

          <div
            v-for="(annotation, annotationName) in annotations[moduleName]"
            :key="annotationName"
            class="has-checked:bg-sky-400/10"
          >
            <div class="list-none ml-4 -indent-4">
              <input
                :id="String(annotationName)"
                type="checkbox"
                :checked="selectedAnnotations.includes(String(annotationName))"
                @change="toggleAnnotation(String(annotationName))"
                class="mr-2"
              />
              <label :for="String(annotationName)">
                <code>{{ annotationName }}</code> –
                {{ annotation.description }}
              </label>
            </div>
          </div>

          <template v-for="(func, fname) in module.functions" :key="fname">
            <div
              v-if="A.isCustom(func)"
              class="cursor-pointer has-checked:bg-sky-400/10"
              @click="addCustom(`${moduleName}:${fname}`)"
            >
              <div class="list-none ml-4 -indent-4">
                <input
                  type="checkbox"
                  class="hidden"
                  :checked="
                    !!selectedCustom.find(
                      (c) => c.annotator === `${moduleName}:${fname}`,
                    )
                  "
                />
                <PhPlusSquare class="text-sm inline -ml-0.5 mr-1" />
                <code>{{ fname }}</code> –
                {{ func.description }}
              </div>
            </div>
          </template>
        </details>
      </LayoutBox>

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

          <div class="flex flex-wrap gap-4">
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
        title="Annotation settings"
        :collapsible="!!selectedConfigs.length"
      >
        <details
          v-for="namespace in uniq(selectedConfigs.map((c) => c._namespace))"
          :key="namespace"
          open
          class="my-4"
        >
          <summary>
            <code>{{ namespace }}</code>
          </summary>

          <template
            v-for="config in selectedConfigs.filter(
              (c) => c._namespace == namespace,
            )"
            :key="config._name"
          >
            <FormKit
              v-if="config.choices"
              type="select"
              :label="config._name"
              v-model="configValues[config._namespace][config._name] as string"
              :help="config.description"
              :options="
                config.choices.map((choice) => ({
                  value: choice || '',
                  label: choice || '<empty>',
                }))
              "
              :placeholder="String(config.default || '')"
            />
            <FormKit
              v-else-if="config.datatype[0] == 'str'"
              type="text"
              :label="config._name"
              v-model="configValues[config._namespace][config._name] as string"
              :help="config.description"
              :placeholder="String(config.default || '')"
            />
            <FormKit
              v-else-if="
                config.datatype[0] == 'int' || config.datatype[0] == 'float'
              "
              type="number"
              :number="config.datatype[0] == 'int' ? 'integer' : 'float'"
              :label="config._name"
              v-model="configValues[config._namespace][config._name] as number"
              :help="config.description"
              :placeholder="String(config.default || '')"
            />
            <FormKit
              v-else-if="config.datatype[0] == 'bool'"
              type="checkbox"
              :label="config._name"
              v-model="configValues[config._namespace][config._name] as boolean"
              :help="config.description"
              :value="Boolean(config.default)"
            />
            <FormKit
              v-else
              :label="config._name"
              v-model="configValues[config._namespace][config._name] as string"
              :placeholder="String(config.default || '')"
            >
              <template #help>
                <div class="formkit-help">{{ config.description }}</div>
                <div class="formkit-help">
                  The type of this field is
                  <code>{{ config.datatype }}</code
                  >; please use YAML syntax.
                </div>
              </template>
            </FormKit>
          </template>
        </details>
      </LayoutBox>

      <LayoutBox
        title="Custom annotation parameters"
        :collapsible="!!selectedCustom.length"
      >
        <details
          v-for="{
            moduleName,
            functionName,
            annotator,
            parameters,
          } in selectedCustomObjects"
          :key="`${moduleName}-${functionName}`"
          open
          class="my-4"
        >
          <summary>
            <code>{{ moduleName }}</code> – <code>{{ functionName }}</code> –
            {{ annotator.description }}
          </summary>

          <div class="flex flex-wrap gap-4">
            <template
              v-for="(parameter, name) in annotator.parameters"
              :key="name"
            >
              <FormKit
                v-if="['str', 'Annotation', 'Output'].includes(parameter.type)"
                type="text"
                v-model="parameters[name] as string"
                :label="String(name)"
                :validation="!parameter.optional ? 'required' : undefined"
                :placeholder="String(parameter.default || '')"
              />
              <FormKit
                v-else-if="parameter.type == 'int' || parameter.type == 'float'"
                type="number"
                :number="parameter.type == 'int' ? 'integer' : 'float'"
                :label="String(name)"
                :validation="!parameter.optional ? 'required' : undefined"
              />
              <FormKit
                v-else-if="parameter.type == 'bool'"
                type="checkbox"
                :label="String(name)"
              />
              <FormKit
                v-else
                :label="String(name)"
                v-model="parameters[name] as string"
                :validation="!parameter.optional ? 'required' : undefined"
                :placeholder="String(parameter.default || '')"
              >
                <template #help>
                  <div class="formkit-help">
                    The type of this field is <code>{{ parameter.type }}</code
                    >; please use YAML syntax.
                  </div>
                </template>
              </FormKit>
            </template>
          </div>
        </details>
      </LayoutBox>

      <LayoutBox title="Config">
        <TextData :text="configOutput" language="yaml" />
      </LayoutBox>
    </FormKitWrapper>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
code {
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
