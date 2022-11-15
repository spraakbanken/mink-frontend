<template>
  <PageTitle>{{ $t("new_corpus") }}</PageTitle>
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
              <label for="description">{{ $t("description") }}</label>
            </th>
            <td>
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
          <tr v-if="fileFormat === 'xml'">
            <th class="lg:w-1/6">
              <label for="textAnnotation">{{ $t("text_annotation") }}:</label>
            </th>
            <td>
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
        <ActionButton variant="primary" @click="submit">
          <icon :icon="['far', 'floppy-disk']" class="mr-1" />
          {{ $t("save") }}
        </ActionButton>
      </div>
    </PendingContent>
  </Section>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";
import { FORMATS_EXT } from "@/assets/corpusConfig";
import { useJwt } from "@/composables/jwt";
import useCorpora from "@/composables/corpora";

const { requireAuthentication } = useJwt();
const { createFromConfig } = useCorpora();

const name = ref("");
const description = ref("");
const fileFormat = ref("txt");
const textAnnotation = ref("");

requireAuthentication();

async function submit() {
  await createFromConfig(
    name.value,
    description.value,
    fileFormat.value,
    textAnnotation.value
  );
}
</script>
