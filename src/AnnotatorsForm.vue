<script setup lang="ts">
import { computed, ref } from "vue";
import { FormKit } from "@formkit/vue";
import { PhMinusSquare, PhPlusSquare } from "@phosphor-icons/vue";
import { uniq } from "es-toolkit";
import * as A from "./annotators.types";
import LayoutBox from "./components/LayoutBox.vue";
import FormKitWrapper from "./components/FormKitWrapper.vue";
import ActionButton from "./components/ActionButton.vue";
import annotatorsFile from "@/assets/annotators.json";

const data = (annotatorsFile as unknown as A.File).annotators;

const expandedAnnotators = ref(true);
const expandedConfig = ref(false);

const selectedAnnotations = ref<string[]>([]);
const selectedAnalyses = computed(() =>
  uniq(selectedAnnotations.value.map((name) => name.split("-").slice(0, 2))),
);
const selectedAnalysisObjects = computed(() =>
  selectedAnalyses.value.map(([moduleName, functionName]) => {
    const annotatorDef = data[moduleName].functions[functionName] as A.Analysis;
    return { moduleName, functionName, annotator: annotatorDef };
  }),
);

type Custom = { annotator: string; parameters: Record<string, unknown> };
const selectedCustom = ref<Custom[]>([]);
const selectedCustomObjects = computed(() =>
  selectedCustom.value.map(({ annotator: name, parameters }) => {
    const [moduleName, functionName] = name.split(":");
    const annotator = data[moduleName].functions[functionName] as A.Custom;
    return { moduleName, functionName, parameters, annotator };
  }),
);

function toggleAnnotation(name: string) {
  const index = selectedAnnotations.value.indexOf(name);
  if (index === -1) selectedAnnotations.value.push(name);
  else selectedAnnotations.value.splice(index, 1);
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <LayoutBox title="Annotators">
      <template #controls>
        <ActionButton
          @click="expandedAnnotators = !expandedAnnotators"
          class="button-mute"
        >
          <PhMinusSquare v-if="expandedAnnotators" class="inline mr-1" />
          <PhPlusSquare v-else class="inline mr-1" />
          {{ expandedAnnotators ? "Close" : "Open" }}
        </ActionButton>
      </template>

      <div v-show="expandedAnnotators">
        <details
          v-for="(module, moduleName) in data"
          :key="moduleName"
          class="has-checked:bg-sky-400/10"
        >
          <summary>
            <code>{{ moduleName }}</code> –
            {{ module.description }}
          </summary>

          <template
            v-for="(func, functionName) in module.functions"
            :key="functionName"
          >
            <details
              v-if="A.isAnalysis(func)"
              class="has-checked:bg-sky-400/10"
            >
              <summary>
                <code>{{ functionName }}</code> –
                {{ func.description }}
              </summary>

              <div
                v-for="(annotation, annotationName) in func.annotations"
                :key="annotationName"
                class="list-none ml-4 -indent-4"
              >
                <input
                  :id="`${moduleName}-${functionName}-${annotationName}`"
                  type="checkbox"
                  :checked="
                    selectedAnnotations.includes(
                      `${moduleName}-${functionName}-${annotationName}`,
                    )
                  "
                  @change="
                    toggleAnnotation(
                      `${moduleName}-${functionName}-${annotationName}`,
                    )
                  "
                  class="mr-2"
                />
                <label :for="`${moduleName}-${functionName}-${annotationName}`">
                  <code>{{ annotationName }}</code> –
                  {{ annotation.description }}</label
                >
              </div>
            </details>

            <div
              v-else
              class="cursor-pointer has-checked:bg-sky-400/10"
              @click="addCustom(`${moduleName}:${functionName}`)"
            >
              <div class="list-none ml-4 -indent-4">
                <input
                  type="checkbox"
                  class="hidden"
                  :checked="
                    !!selectedCustom.find(
                      (c) => c.annotator === `${moduleName}:${functionName}`,
                    )
                  "
                />
                <PhPlusSquare class="text-sm inline -ml-0.5 mr-1" />
                <code>{{ functionName }}</code> –
                {{ func.description }}
              </div>
            </div>
          </template>
        </details>
      </div>
    </LayoutBox>

    <LayoutBox title="Configuration">
      <template #controls>
        <ActionButton
          @click="expandedConfig = !expandedConfig"
          class="button-mute"
        >
          <PhMinusSquare v-if="expandedConfig" class="inline mr-1" />

          <PhPlusSquare v-else class="inline mr-1" />
          {{ expandedConfig ? "Close" : "Open" }}
        </ActionButton>
      </template>

      <div v-show="expandedConfig">
        <FormKitWrapper>
          <details
            v-for="{
              annotator,
              moduleName,
              functionName,
            } in selectedAnalysisObjects"
            :key="`${moduleName}-${functionName}`"
            open
            class="my-4"
          >
            <summary>
              <code>{{ moduleName }}</code> – <code>{{ functionName }}</code> –
              {{ annotator.description }}
            </summary>

            <template v-if="'config' in annotator">
              <template v-for="(config, name) in annotator.config" :key="name">
                <FormKit
                  v-if="config.choices"
                  type="select"
                  :label="String(name)"
                  :help="config.description"
                  :options="
                    config.choices.map((choice) => ({
                      value: choice || '',
                      label: choice || '<empty>',
                    }))
                  "
                  :value="String(config.default || '')"
                  :placeholder="String(config.default || '')"
                />
                <FormKit
                  v-else-if="config.datatype[0] == 'str'"
                  type="text"
                  :label="String(name)"
                  :help="config.description"
                  :placeholder="String(config.default || '')"
                />
                <FormKit
                  v-else-if="
                    config.datatype[0] == 'int' || config.datatype[0] == 'float'
                  "
                  type="number"
                  :number="config.datatype[0] == 'int' ? 'integer' : 'float'"
                  :label="String(name)"
                  :help="config.description"
                  :placeholder="String(config.default || '')"
                />
                <FormKit
                  v-else-if="config.datatype[0] == 'bool'"
                  type="checkbox"
                  :label="String(name)"
                  :help="config.description"
                  :value="Boolean(config.default)"
                />
                <FormKit
                  v-else
                  :label="String(name)"
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
            </template>
          </details>

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

            <template
              v-for="(parameter, name) in annotator.parameters"
              :key="name"
            >
              <FormKit
                v-if="parameter.type == 'str'"
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
          </details>
        </FormKitWrapper>
      </div>
    </LayoutBox>
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
