<template>
  <h1>Korpus: {{ route.params.corpusId }}</h1>
  <Breadcrumbs />
  <div class="flex flex-wrap">
    <Section title="Texter" class="lg:w-2/3 lg:pr-4">
      <Sources :corpusId="corpusId" />
    </Section>
    <Section title="Analys" class="lg:w-1/3">
      <Section v-if="jobStatus">
        <div>{{ jobStatus.message }}</div>
        <pre class="text-sm">{{ jobStatus.sparv_output }}</pre>
      </Section>
      <ActionButton
        v-if="exports && exports.length"
        @click="downloadResult"
        class="mr-2 bg-green-200 border-green-300"
      >
        Ladda ner resultat
      </ActionButton>
      <router-link
        :to="`/corpus/${corpusId}/config`"
        custom
        v-slot="{ navigate }"
      >
        <ActionButton @click="navigate" class="bg-blue-100 border-blue-200">
          Ny analys
        </ActionButton>
      </router-link>
    </Section>
  </div>
  <div>
    <ActionButton @click="deleteCorpus" class="bg-red-200 border-red-300">
      Radera korpus
    </ActionButton>
  </div>
</template>

<script setup>
import { onUnmounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getJob,
  getExports,
  removeCorpus,
  downloadExports,
} from "@/assets/api";
import { computed, ref } from "@vue/reactivity";
import { spin } from "@/assets/spin";
import Sources from "@/components/Sources.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Section from "@/components/layout/Section.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const corpusId = computed(() => route.params.corpusId);
const jobStatus = computed(() => store.state.corpora[corpusId.value].status);
const exports = computed(() => store.state.corpora[corpusId.value].exports);

let loadJobTimer = null;
async function loadJob() {
  spin(getJob(corpusId.value), "Kollar analysstatus").then((status) => {
    store.commit("setStatus", { corpusId: corpusId.value, status });
    if (status.job_status != "done")
      // Refresh automatically.
      loadJobTimer = setTimeout(loadJob, 10_000);
  });
  spin(getExports(corpusId.value), "Listar resultatfiler").then((exports) =>
    store.commit("setExports", { corpusId: corpusId.value, exports })
  );
}

loadJob();

async function downloadResult() {
  spin(downloadExports(route.params.corpusId), "Laddar ner analysresultat");
}

async function deleteCorpus() {
  await spin(removeCorpus(corpusId.value), "Raderar korpus");
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}

onUnmounted(() => clearTimeout(loadJobTimer));
</script>

<style>
</style>
