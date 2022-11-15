<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useJwt } from "@/composables/jwt";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { t } = useI18n();
const { refreshJwt } = useJwt();
const corpusId = useCorpusIdParam();

async function deleteCorpus() {
  const token = `corpus/${corpusId}`;
  // Delete corpus in the backend.
  await spin(api.removeCorpus(corpusId), t("corpus.deleting"), token);
  // The backend will have updated the remote JWT, so refresh our copy.
  // The backend uses the corpus list within it when listing available corpora.
  await refreshJwt();

  store.commit("removeCorpus", corpusId);
  router.push("/");
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section :title="t('corpus.delete')">
      <p class="my-2">{{ $t("corpus.delete.ask") }}</p>

      <div>
        <ActionButton variant="danger" class="mr-4" @click="deleteCorpus">
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
