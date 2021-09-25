<script setup>
import { computed, ref } from "@vue/reactivity";
import { initialize } from "./assets/api";
import router from "./router";
import store from "./store";
import { listen } from "@/assets/spin";
import Spinner from "@/components/Spinner.vue";

const auth = computed(() => store.state.auth);
const spinning = ref(null);

listen((messages) => (spinning.value = messages));

// Initialize API client.
if (auth.value) {
  initialize(auth.value.username, auth.value.password);
}

function logout() {
  store.commit("logout");
  router.push("/login");
}
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
  <footer>
    <hr />
    <button v-if="auth" @click="logout">Logga ut</button>
    <div v-if="spinning">
      <Spinner />
      <div v-for="message in spinning" :key="message">{{ message }}</div>
    </div>
  </footer>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}

pre {
  text-align: left;
}
</style>
