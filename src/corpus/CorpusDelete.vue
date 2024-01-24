<script setup lang="ts">
import { useRouter } from "vue-router";
import useCorpusIdParam from "./corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useDeleteCorpus from "./deleteCorpus.composable";
import { useCorpusStore } from "@/store/corpus.store";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { deleteCorpus } = useDeleteCorpus();
const corpusStore = useCorpusStore();

async function doDelete() {
  await deleteCorpus(corpusId);
  if (!(corpusId in corpusStore.corpora)) {
    router.push("/corpus");
  }
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}`" blocking>
    <LayoutSection :title="$t('corpus.delete')">
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
    </LayoutSection>
  </PendingContent>
</template>

<style></style>
