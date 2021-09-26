<template>
  <h1>Hej {{ name }}!</h1>
  <div class="my-4">
    <ActionButton @click="logout">Logga ut</ActionButton>
  </div>
  <Section v-if="corpora.length" title="Korpusar">
    <div class="flex flex-wrap -mx-2">
      <router-link
        v-for="corpusId in corpora"
        :key="corpusId"
        :to="`/corpus/${corpusId}`"
        custom
        v-slot="{ navigate }"
      >
        <PadButton @click="navigate">{{ corpusId }}</PadButton>
      </router-link>
      <router-link to="/corpus" custom v-slot="{ navigate }">
        <PadButton @click="navigate" class="create"> + Ny korpus </PadButton>
      </router-link>
    </div>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { listCorpora } from "@/assets/api";
import { spin } from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";

const store = useStore();
const router = useRouter();

const name = computed(() => store.state.auth?.username);
const corpora = computed(() => Object.keys(store.state.corpora));

spin(listCorpora(), "Hämtar korpusar").then((corporaFetched) =>
  store.commit("setCorpora", corporaFetched)
);

function logout() {
  store.commit("logout");
  router.push("/login");
}
</script>
