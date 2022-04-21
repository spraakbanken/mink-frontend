<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section title="Metadata">
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
  </PendingContent>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { removeCorpus } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();

const { corpusId } = useCorpusIdParam();

async function deleteCorpus() {
  const token = `corpus/${corpusId.value}`;
  await spin(removeCorpus(corpusId.value), "Raderar korpus", token);
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}
</script>

<style></style>
