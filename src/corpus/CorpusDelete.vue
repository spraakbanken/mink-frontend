<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useCorpusIdParam from "./corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpus from "./corpus.composable";

const router = useRouter();
const { t } = useI18n();
const corpusId = useCorpusIdParam();
const { deleteCorpus } = useCorpus(corpusId);

async function doDelete() {
  await deleteCorpus();
  router.push("/");
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section :title="t('corpus.delete')">
      <p class="my-2">{{ $t("corpus.delete.ask") }}</p>

      <div>
        <ActionButton variant="danger" class="mr-4" @click="doDelete">
          <icon :icon="['far', 'trash-can']" />
          {{ $t("corpus.delete") }}
        </ActionButton>

        <router-link :to="`/corpus/${corpusId}`">
          <ActionButton>{{ $t("cancel") }}</ActionButton>
        </router-link>
      </div>
    </Section>
  </PendingContent>
</template>

<style></style>
