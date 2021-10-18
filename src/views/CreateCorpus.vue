<template>
  <PageTitle>Ny korpus</PageTitle>
  <Section ref="refForm">
    <table class="w-full my-4">
      <tbody>
        <tr>
          <th class="text-right">
            <label for="name">Namn:</label>
          </th>
          <td>
            <input id="name" v-model="name" class="border" />
          </td>
        </tr>
        <tr>
          <th />
          <td>
            <ActionButton @click="submit" class="bg-green-200 border-green-300">
              Spara
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus } from "@/assets/api";
import { useRouter } from "vue-router";
import { spin } from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const name = ref("");
const message = ref(null);
const refForm = ref(null);

async function submit() {
  spin(createCorpus(name.value), "Skapar korpus", refForm.value.$el)
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => {
      store.commit("addCorpus", name.value);
      router.push(`/corpus/${name.value}`);
    });
}
</script>
