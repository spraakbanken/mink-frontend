<script lang="ts" setup>
import { computed } from "vue";
import { parseCsv, type Model } from "./csvExport";
import SparvValue from "./SparvValue.vue";
import { enarray } from "@/util";

const props = defineProps<{
  csv: string;
}>();

const model = computed<Model | null>(() => {
  try {
    return parseCsv(props.csv);
  } catch (error) {
    console.error(error);
    return null;
  }
});
</script>

<template>
  <div class="overflow-auto" style="max-height: 80svh">
    <table v-if="model">
      <thead class="sticky top-0 bg-white dark:bg-zinc-900">
        <tr>
          <th
            v-for="{ analysis, name } in model.header"
            :key="`${analysis}.${name}`"
          >
            {{ $t(`corpus.csv.attr.${name}`, name) }}
            <template v-if="analysis"> ({{ analysis }}) </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(sentence, i) in model.sentences" :key="i">
          <tr v-if="sentence.structs.length">
            <td
              :colspan="model.header.length"
              class="p-1 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <table>
                <tbody>
                  <template
                    v-for="{ struct, attrs } in sentence.structs"
                    :key="struct"
                  >
                    <tr v-for="(attr, i) in attrs" :key="attr.name">
                      <th v-if="i == 0" scope="row" :rowspan="attrs.length">
                        {{ $t(`corpus.csv.struct.${struct}`, struct) }}
                      </th>
                      <th scope="row">
                        {{
                          $t(
                            `corpus.csv.struct.${struct}.${attr.name}`,
                            attr.name,
                          )
                        }}
                      </th>
                      <td class="whitespace-pre-wrap">
                        <SparvValue
                          v-for="(value, i) in enarray(attr.value)"
                          :key="i"
                          :type="attr.name"
                          :value
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-for="(token, i) in sentence.tokens" :key="i">
            <td
              v-for="(values, j) in token"
              :key="j"
              class="p-1 border border-zinc-300 dark:border-zinc-700 whitespace-pre-wrap"
              :class="{
                'bg-zinc-50 dark:bg-zinc-800': j == 0,
              }"
            >
              <SparvValue
                v-for="(value, k) in enarray(values)"
                :key="k"
                :type="model.header[j].name"
                :value
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <slot v-else name="error">
      <div class="italic">
        {{ $t("corpus.csv.parse_error") }}
      </div>
    </slot>
  </div>
</template>
