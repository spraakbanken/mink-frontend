<script setup lang="ts">
import { computed, reactive } from "vue";
import { pickBy } from "es-toolkit";
import { FormKit } from "@formkit/vue";
import * as A from "./annotators.types";
import LayoutBox from "./components/LayoutBox.vue";
import FormKitWrapper from "./components/FormKitWrapper.vue";
import annotatorsFile from "@/assets/annotators.json";

const data = (annotatorsFile as unknown as A.File).annotators;

const selected = reactive(new Set<string>());
const functions = computed(() =>
  [...selected].reduce<Record<string, A.Annotator>>(
    (acc, name) => ({ ...acc, [name]: findFunction(name) }),
    {},
  ),
);
const analyses = computed(
  () => pickBy(functions.value, A.isAnalysis) as Record<string, A.Analysis>,
);
/** Merged config from selected analyses */
const configs = computed(() => {
  const configs = Object.values(analyses.value).map((a) => a.config!);
  return configs.reduce((acc, c) => ({ ...acc, ...c }), {});
});

function findFunction(name: string): A.Annotator {
  const [moduleName, functionName] = name.split("-");
  return data[moduleName].functions[functionName];
}

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

        <details
          v-for="(func, functionName) in module.functions"
          :key="functionName"
        >
          <summary>
            <code>{{ functionName }}</code> –
            {{ func.description }}
          </summary>

          <div v-if="A.isAnalysis(func)">
            <div
              v-for="(annotation, annotationName) in func.annotations"
              :key="annotationName"
            >
              <input
                :id="`${moduleName}-${functionName}-${annotationName}`"
                type="checkbox"
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
          </div>

          <div v-else>
            {{ func }}
          </div>
        </details>
      </details>
    </LayoutBox>

    <LayoutBox title="Configuration" class="w-96 grow">
      <FormKitWrapper>
        <FormKit
          v-for="(config, name) in configs"
          :key="name"
          :label="config.description"
          :placeholder="String(config.default)"
        />
      </FormKitWrapper>
    </LayoutBox>
  </div>
</template>

<style scoped>
code {
  font-size: smaller;
}
details {
  margin-inline-start: 1rem;
}
summary {
  margin-inline-start: -1rem;
  cursor: pointer;
}
</style>
