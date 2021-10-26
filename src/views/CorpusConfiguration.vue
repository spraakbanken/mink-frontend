<template>
  <Section title="Konfiguration">
    <table class="w-full my-4">
      <thead></thead>
      <tbody>
        <tr>
          <th class="text-right">
            <label for="format">Format:</label>
          </th>
          <td>
            <select id="format" v-model="format">
              <option>txt</option>
              <option>xml</option>
            </select>
          </td>
        </tr>
        <tr>
          <th />
          <td class="py-4" ref="refSubmit">
            <ActionButton
              @click="save"
              class="mr-2 bg-blue-100 border-blue-200"
            >
              Spara konfiguration
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { putConfig } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";

const { corpusId } = useCorpusIdParam();
const format = ref("txt");
const refSubmit = ref(null);

async function save() {
  await spin(
    putConfig(corpusId.value, { format: format.value }),
    "Sparar konfiguration",
    refSubmit.value
  );
}
</script>

<style></style>
