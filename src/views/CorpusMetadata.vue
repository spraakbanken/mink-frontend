<template>
  <Section title="Metadata" ref="refForm">
    <table class="w-full my-4">
      <tbody>
        <tr>
          <th class="text-right">Identifierare:</th>
          <td>{{ corpusId }}</td>
        </tr>
        <tr>
          <th />
          <td>
            <ActionButton
              @click="deleteCorpus"
              class="bg-red-200 border-red-300"
            >
              Radera korpus
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { removeCorpus } from "@/assets/api";
import { ref } from "@vue/reactivity";
import { spin } from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";

const router = useRouter();
const store = useStore();

const { corpusId } = useCorpusIdParam();
const refForm = ref(null);

async function deleteCorpus() {
  await spin(removeCorpus(corpusId.value), "Raderar korpus", refForm.value.$el);
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}
</script>

<style></style>
