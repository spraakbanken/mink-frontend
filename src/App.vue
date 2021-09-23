<script setup>
import { computed } from "@vue/reactivity";
import { initialize } from "./assets/api";
import router from "./router";
import store from "./store";

const auth = computed(() => store.state.auth);

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
