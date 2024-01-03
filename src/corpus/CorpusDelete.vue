<script setup>
import { useRouter } from "vue-router";
import useCorpusIdParam from "./corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpus from "./corpus.composable";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { deleteCorpus } = useCorpus(corpusId);

async function doDelete() {
  await deleteCorpus();
  router.push("/corpus");
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}`" blocking>
    <Section :title="$t('corpus.delete')">
      <p class="my-2">{{ $t("corpus.delete.ask") }}</p>

      <div>
        <ActionButton class="button-danger mr-4" @click="doDelete">
          <icon :icon="['far', 'trash-can']" />
          {{ $t("corpus.delete") }}
        </ActionButton>

        <RouteButton :to="`/corpus/${corpusId}`">{{
          $t("cancel")
        }}</RouteButton>
      </div>
    </Section>
  </PendingContent>
</template>

<style></style>
