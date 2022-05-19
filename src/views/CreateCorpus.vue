<template>
  <PageTitle>{{ $t("new") }} {{ $t("corpus") }}</PageTitle>
  <Section>
    <PendingContent on="create">
      <table class="w-full my-4">
        <tbody>
          <tr>
            <th class="text-right">
              <label for="name">{{ $t("name") }}:</label>
            </th>
            <td>
              <input id="name" v-model="name" class="border w-70" />
            </td>
          </tr>
          <tr>
            <th class="text-right">
              <label for="id">{{ $t("identifier") }}:</label>
            </th>
            <td>
              <input id="id" v-model="id" class="border w-70" />
            </td>
          </tr>
          <tr>
            <th class="text-right">
              <label for="description">{{ $t("description") }}:</label>
            </th>
            <td>
              <input id="description" v-model="description" class="border" />
            </td>
          </tr>
          <tr>
            <th class="text-right">
              <label for="fileFormat">{{ $t("fileFormat") }}:</label>
            </th>
            <td>
              <select id="fileFormat" v-model="fileFormat">
                <option v-for="ext in FORMATS_EXT" :value="ext">
                  {{ $t(ext) }} (.{{ ext }})
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th />
            <td>
              <ActionButton
                @click="submit"
                class="bg-green-200 border-green-300"
              >
                Spara
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
    </PendingContent>
  </Section>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus } from "@/assets/api";
import { useRouter } from "vue-router";
import useSpin from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import { useStore } from "vuex";
import PendingContent from "@/components/PendingContent.vue";
import { FORMATS_EXT } from "@/assets/corpusConfig";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();

const name = ref("");
const id = ref("");
const description = ref("");
const fileFormat = ref("txt");
const message = ref(null);

async function submit() {
  spin(
    createCorpus(id.value, name.value, description.value, fileFormat.value),
    "Skapar korpus",
    "create"
  )
    .then(() => {
      store.commit("addCorpus", id.value);
      router.push(`/corpus/${id.value}`);
    })
    .catch(
      (reason) =>
        (message.value = reason.response
          ? reason.response.data.message
          : reason)
    );
}
</script>
