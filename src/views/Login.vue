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
  {{ user }}
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import router from "@/router";

const username = ref("");
const password = ref("");

const store = useStore();

async function submitLogin() {
  axios
    .post("https://ws.spraakbanken.gu.se/ws/min-sb/init", null, {
      auth: { username: username.value, password: password.value },
    })
    .then((response) => {
      store.commit("setUser", username.value);
      router.push("/");
    })
    .catch((response) => {
      console.log("catch", response);
    });
}
</script>

<style>
</style>
