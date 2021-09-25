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
  <header class="site-header">
    <div class="site-title">
      <router-link to="/">Min språkbank</router-link>
    </div>
    <div class="menu">
      <div class="menu-item spinner-messages" v-if="spinning">
        <div v-for="message in spinning" :key="message">{{ message }}</div>
      </div>
      <div class="menu-item" v-if="spinning">
        <Spinner />
      </div>
      <div class="menu-item sb-logo">
        <a href="https://spraakbanken.gu.se/">
          <img src="@/assets/sbx1r.svg" />
        </a>
      </div>
      <div class="menu-item">
        <button v-if="auth" @click="logout">Logga ut</button>
      </div>
    </div>
  </header>
  <hr />
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}

pre {
  text-align: left;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5rem;
}

.site-header > * {
  height: 3rem;
}

.site-title {
  font-size: 2.5rem;
}

.menu {
  height: 100%;
  display: flex;
  align-items: center;
}

.menu-item {
  margin: 0 0.5rem;
}

.spinner-messages {
  align-self: flex-start;
  height: 100%;
  overflow: hidden;
  text-align: right;
  font-size: smaller;
}

.sb-logo {
  max-width: 15rem;
}

.sb-logo img {
  width: 100%;
}
</style>
