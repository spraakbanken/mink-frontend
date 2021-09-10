<template>
  <h1>Min språkbank</h1>
  <h2>Logga in</h2>
  <div>
    <input v-model="username" />
  </div>
  <div>
    <input type="password" v-model="password" />
  </div>
  <div>
    <input type="submit" @click="submitLogin" />
  </div>
  {{ username }}
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const username = ref("");
const password = ref("");

const store = useStore();
const user = computed(() => store.state.user);

async function submitLogin() {
  axios
    .post("https://ws.spraakbanken.gu.se/ws/min-sb/init", null, {
      auth: { username: username.value, password: password.value },
    })
    .then((response) => {
      console.log("then", response);
    })
    .catch((response) => {
      console.log("catch", response);
    });
}
</script>

<style>
</style>
