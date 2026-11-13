<script lang="ts" setup>
import { computed } from "vue";
import { enarray } from "@/util";

const props = defineProps<{
  csv: string;
}>();

type Model = {
  header: string[];
  sentences: Sentence[];
};

type Sentence = {
  /** A list of structural attribute values */
  struct: Attribute[];
  /** Positional attributes */
  tokens: Value[][];
};

type Attribute = { name: string; value: Value };

type Value = string | string[];

const model = computed<Model>(() => {
  const lines = props.csv.split("\n");
  const header = lines.shift()?.split("\t") || [];

  let sentence: Sentence = { struct: [], tokens: [] };
  const sentences: Sentence[] = [sentence];

  for (const line of lines) {
    // Comment line: parse a structural attribute and add to current sentence
    if (line.startsWith("#")) {
      // If the current sentence has tokens, start a new sentence
      if (sentence.tokens.length) {
        sentence = { struct: [], tokens: [] };
        sentences.push(sentence);
      }
      const match = line.match(/^# (\S+) = (.*)$/);
      const [, name, value] = match || [];
      sentence.struct.push({ name, value: parseValue(value) });
      continue;
    }

    // Ordinary CSV line: each is a token of the current sentence
    const values = line.split("\t").map(parseValue);
    sentence.tokens.push(values);
  }

  return { header, sentences: sentences };
});

const parseValue = (value: string): Value =>
  value.startsWith("|") && value.endsWith("|")
    ? value.slice(1, -1).split("|")
    : value;
</script>

<template>
  <div class="overflow-auto" style="max-height: 80svh">
    <table>
      <thead class="sticky top-0 bg-white dark:bg-zinc-900">
        <tr>
          <th v-for="(col, i) in model.header" :key="i">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(sentence, i) in model.sentences" :key="i">
          <tr>
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
  </div>
</template>
