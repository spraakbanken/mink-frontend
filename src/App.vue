<script setup>
import { computed } from "@vue/reactivity";
import router from "./router";
import store from "./store";

const auth = computed(() => store.state.auth);

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
    <button v-if="auth" @click="logout">Logga ut</button>
  </footer>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
