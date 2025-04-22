<script setup lang="ts">
import { FormKit } from "@formkit/vue";

const props = defineProps<{
  name: string;
  datatype: string[];
  description: string;
  defaultValue: unknown;
  choices?: string[];
}>();
const model = defineModel<unknown>();

const primaryType = props.datatype[0];
</script>

<template>
  <div>
    <FormKit
      v-if="choices"
      type="select"
      :label="name"
      v-model="model as string"
      :help="description"
      :options="
        choices.map((choice) => ({
          value: choice || '',
          label: choice || '<empty>',
        }))
      "
      :placeholder="String(defaultValue || '')"
    />
    <FormKit
      v-else-if="primaryType == 'str'"
      type="text"
      :label="name"
      v-model="model as string"
      :help="description"
      :placeholder="String(defaultValue || '')"
    />
    <FormKit
      v-else-if="primaryType == 'int' || primaryType == 'float'"
      type="number"
      :number="primaryType == 'int' ? 'integer' : 'float'"
      :label="name"
      v-model="model as number"
      :help="description"
      :placeholder="String(defaultValue || '')"
    />
    <FormKit
      v-else-if="primaryType == 'bool'"
      type="checkbox"
      :label="name"
      v-model="model as boolean"
      :help="description"
      :value="Boolean(defaultValue)"
    />
    <FormKit
      v-else
      :label="name"
      v-model="model as string"
      :placeholder="String(defaultValue || '')"
    >
      <template #help>
        <div class="formkit-help">{{ description }}</div>
        <div class="formkit-help">
          The type of this field is
          <code>{{ datatype }}</code
          >; please use YAML syntax.
        </div>
      </template>
    </FormKit>
  </div>
</template>
