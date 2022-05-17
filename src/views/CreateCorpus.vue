<template>
  <PageTitle>{{ $t("new") }} {{ $t("corpus") }}</PageTitle>
  <Section title="none">
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
                <option>txt</option>
                <option>xml</option>
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

const router = useRouter();
const store = useStore();
const { spin } = useSpin();

const name = ref("");
const description = ref("");
const fileFormat = ref("");
const message = ref(null);

async function submit() {
  spin(createCorpus(name.value), "Skapar korpus", "create")
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => {
      store.commit("addCorpus", name.value);
      router.push(`/corpus/${name.value}`);
    });
}
</script>
