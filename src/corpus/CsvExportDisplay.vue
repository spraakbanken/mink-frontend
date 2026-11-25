<script lang="ts" setup>
import { computed } from "vue";
import { parseCsv, type Model } from "./csvExport";
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
          <th v-for="(col, i) in model.header" :key="i">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(sentence, i) in model.sentences" :key="i">
          <tr v-if="sentence.struct.length">
            <td
              :colspan="model.header.length"
              class="p-1 border border-zinc-300 dark:border-zinc-700"
            >
              <table>
                <tbody>
                  <tr v-for="attr in sentence.struct" :key="attr.name">
                    <th scope="row">{{ attr.name }}</th>
                    <td class="whitespace-pre-wrap">
                      {{ enarray(attr.value).join("\n") }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-for="(token, i) in sentence.tokens" :key="i">
            <td
              v-for="(value, j) in token"
              :key="j"
              class="p-1 border border-zinc-300 dark:border-zinc-700 whitespace-pre-wrap"
            >
              {{ enarray(value).join("\n") }}
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
