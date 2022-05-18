<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section title="metadata">
      <table class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="w-1/6">{{ $t("corpus") }} {{ $t("name") }}</th>
            <td class="w-1/2">
              <i>{{ corpusId }}</i>
            </td>
          </tr>
          <tr>
            <th class="w-1/6">{{ $t("description") }}</th>
            <td class="w-1/2"><i>None</i></td>
          </tr>
          <tr>
            <th class="w-1/6">{{ $t("fileFormat") }}</th>
            <td class="w-1/2"><i>None</i></td>
          </tr>
        </tbody>
      </table>
      <ActionButton class="bg-red-200 border-red-300" @click="deleteCorpus">
        {{ $t("deleteCorpus") }}
      </ActionButton>
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
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
  await spin(removeCorpus(corpusId.value), "Raderar korpus", token);
}
</script>

<style></style>
