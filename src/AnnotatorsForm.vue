<script setup lang="ts">
import { computed, reactive } from "vue";
import { pickBy } from "es-toolkit";
import { FormKit } from "@formkit/vue";
import * as A from "./annotators.types";
import LayoutBox from "./components/LayoutBox.vue";
import FormKitWrapper from "./components/FormKitWrapper.vue";
import annotatorsFile from "@/assets/annotators.json";

const data = (annotatorsFile as unknown as A.File).annotators;

const selected = reactive(
  new Set<string>([
    "misc-affix",
    "hunpos-msdtag-<token>:hunpos.msd",
    "saldo-annotate-<token>:saldo.baseform",
    "stanza-annotate_swe-<token>:stanza.pos",
  ]),
);
const functions = computed(() =>
  Object.fromEntries(
    [...selected].map((name) => {
      const [module, func] = name.split("-");
      return [`${module}-${func}`, data[module].functions[func]];
    }),
  ),
);
const analyses = computed(
  () =>
    pickBy(functions.value, (a) => A.isAnalysis(a) && "config" in a) as Record<
      string,
      A.Analysis
    >,
);

function toggleSelected(annotationName: string) {
  if (selected.has(annotationName)) {
    selected.delete(annotationName);
  } else {
    selected.add(annotationName);
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <LayoutBox title="Annotators" class="w-96 grow">
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
          <details v-if="A.isAnalysis(func)" class="has-checked:bg-sky-400/10">
            <summary>
              <code>{{ functionName }}</code> –
              {{ func.description }}
            </summary>

            <div
              v-for="(annotation, annotationName) in func.annotations"
              :key="annotationName"
            >
              <input
                :id="`${moduleName}-${functionName}-${annotationName}`"
                type="checkbox"
                :checked="
                  selected.has(
                    `${moduleName}-${functionName}-${annotationName}`,
                  )
                "
                @change="
                  toggleSelected(
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

          <div v-else>
            <input
              :id="`${moduleName}-${functionName}`"
              type="checkbox"
              :checked="selected.has(`${moduleName}-${functionName}`)"
              @change="toggleSelected(`${moduleName}-${functionName}`)"
              class="mr-2"
            />
            <label :for="`${moduleName}-${functionName}`">
              <code>{{ functionName }}</code> –
              {{ func.description }}
            </label>
          </div>
        </template>
      </details>
    </LayoutBox>

    <LayoutBox title="Configuration" class="w-96 grow">
      <FormKitWrapper>
        <details
          v-for="(annotator, annotatorName) in functions"
          :key="annotatorName"
          open
          class="my-4"
        >
          <summary>
            <code>{{ String(annotatorName).split("-")[0] }}</code> –
            <code>{{ String(annotatorName).split("-")[1] }}</code> –
            {{ annotator.description }}
          </summary>

          <template v-if="A.isAnalysis(annotator) && 'config' in annotator">
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
                    The type of this field is <code>{{ config.datatype }}</code
                    >; please use YAML syntax.
                  </div>
                </template>
              </FormKit>
            </template>
          </template>

          <template v-else-if="A.isCustom(annotator)">
            <template
              v-for="(parameter, name) in annotator.parameters"
              :key="name"
            >
              <FormKit
                v-if="parameter.type == 'str'"
                type="text"
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
          </template>
        </details>
      </FormKitWrapper>
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
  margin-inline-start: -1rem;
  cursor: pointer;
}
</style>
