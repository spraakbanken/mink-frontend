<script setup lang="ts">
import { useRouter } from "vue-router";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useDeleteCorpus from "@/corpus/deleteCorpus.composable";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useResourceStore } from "@/store/resource.store";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { deleteCorpus } = useDeleteCorpus();
const resourceStore = useResourceStore();

async function doDelete() {
  await deleteCorpus(corpusId);
  if (!(corpusId in resourceStore.corpora)) {
    router.push("/library");
  }
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}`" blocking>
    <LayoutSection :title="$t('corpus.delete')">
      <p class="my-2">{{ $t("resource.delete.ask") }}</p>

      <div>
        <ActionButton class="button-danger mr-4" @click="doDelete">
          <icon :icon="['far', 'trash-can']" />
          {{ $t("corpus.delete") }}
        </ActionButton>

        <RouteButton :to="`/library/corpus/${corpusId}`">{{
          $t("cancel")
        }}</RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>

<style></style>
