<script setup lang="ts">
import { FormKit } from "@formkit/vue";

defineProps<{
  type: string;
  name: string;
  optional?: boolean;
  defaultValue?: unknown;
}>();

const model = defineModel<unknown>();
</script>

<template>
  <FormKit
    v-if="['str', 'Annotation', 'Output'].includes(type)"
    type="text"
    v-model="model as string"
    :label="name"
    :validation="!optional ? 'required' : undefined"
    :placeholder="String(defaultValue || '')"
  />
  <!-- <FormKit
                v-else-if="type == 'int' || type == 'float'"
                type="number"
                :number="type == 'int' ? 'integer' : 'float'"
                :label="String(name)"
                :validation="!optional ? 'required' : undefined"
              />
              <FormKit
                v-else-if="type == 'bool'"
                type="checkbox"
                :label="String(name)"
              /> -->
  <FormKit
    v-else
    :label="name"
    v-model="model as string"
    :validation="!optional ? 'required' : undefined"
    :placeholder="String(defaultValue || '')"
  >
    <template #help>
      <div class="formkit-help">
        The type of this field is <code>{{ type }}</code
        >; please use YAML syntax.
      </div>
    </template>
  </FormKit>
</template>
