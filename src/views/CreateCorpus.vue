<template>
  <PageTitle>{{ $t("new") }} {{ $t("corpus") }}</PageTitle>
  <Section>
    <PendingContent on="create">
      <table class="w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">
              <label for="name">{{ $t("name") }}</label>
            </th>
            <td>
              <input id="name" v-model="name" class="border w-72 p-1" />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">
              <label for="id">{{ $t("identifier") }}</label>
            </th>
            <td>
              <input
                id="id"
                v-model="id"
                class="border w-72 p-1 font-mono text-sm"
                required="required"
              />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">
              <label for="description">{{ $t("description") }}</label>
            </th>
            <td class="">
              <textarea
                v-model="description"
                class="block border w-full p-1 h-20"
              />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">
              <label for="fileFormat">{{ $t("fileFormat") }}</label>
            </th>
            <td>
              <select
                id="fileFormat"
                v-model="fileFormat"
                class="border w-72 p-1"
              >
                <option v-for="ext in FORMATS_EXT" :value="ext">
                  {{ $t(ext) }} (.{{ ext }})
                </option>
              </select>
            </td>
          </tr>
          <tr v-show="fileFormat === 'xml'">
            <th class="lg:w-1/6">
              <label for="textAnnotation">{{ $t("text_annotation") }}:</label>
            </th>
            <td class="">
              <input
                id="textAnnotation"
                v-model="textAnnotation"
                :required="fileFormat === 'xml'"
                class="border w-72 p-1"
              />
              <div class="text-sm py-1">
                {{ $t("text_annotation_help") }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center">
        <ActionButton @click="submit" class="bg-green-200 border-green-300">
          Spara
        </ActionButton>
      </div>
    </PendingContent>
  </Section>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus, putConfig } from "@/assets/api";
import { useRouter } from "vue-router";
import useSpin from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import { useStore } from "vuex";
import PendingContent from "@/components/PendingContent.vue";
import { FORMATS_EXT, makeConfig } from "@/assets/corpusConfig";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();

const name = ref("");
const id = ref("");
const description = ref("");
const fileFormat = ref("txt");
const textAnnotation = ref("");
const message = ref(null);

async function submit() {
  if (!id.value) {
    message.value = "Identifier is required";
    return;
  }

  const langify = (str) => ({ swe: str, eng: str });
  const config = {
    name: langify(name.value),
    description: langify(description.value),
    format: fileFormat.value,
    textAnnotation: textAnnotation.value,
  };
  const configYaml = makeConfig(id.value, config);

  try {
    await spin(createCorpus(id.value), "Skapar korpus", "create");
    store.commit("addCorpus", id.value);
    await spin(
      putConfig(id.value, configYaml),
      "Konfigurerar korpus",
      `corpus/${id.value}/config`
    );
    store.commit("setConfig", { corpusId: id.value, config });
    router.push(`/corpus/${id.value}`);
  } catch (reason) {
    message.value = reason.response ? reason.response.data.message : reason;
  }
}
</script>

<style scoped>
th,
td {
  @apply align-baseline;
}
</style>
