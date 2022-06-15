<template>
  <PageTitle>{{ name }}</PageTitle>
  <div v-if="enableLogout" class="my-4">
    <ActionButton @click="logout">{{ $t("logout") }}</ActionButton>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const name = computed(() => store.state.auth?.username);

function logout() {
  store.commit("logout");
  router.push("/login");
}

const enableLogout = false; // For now.
</script>

<style></style>
