<script setup>
import { computed } from "@vue/reactivity";
import router from "./router";
import store from "./store";

const user = computed(() => store.state.user);

function logout() {
  store.commit("setUser", null);
  router.push("/login");
}
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
  <footer>
    <button v-if="user" @click="logout">Logga ut</button>
  </footer>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
