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
  <div>
    {{ message }}
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import router from "@/router";

const username = ref("");
const password = ref("");
const message = ref(null);

const store = useStore();

async function submitLogin() {
  message.value = "Authenticating...";
  const auth = { username: username.value, password: password.value };
  axios
    .post("https://ws.spraakbanken.gu.se/ws/min-sb/init", null, {
      auth,
    })
    .then((response) => {
      store.commit("login", auth);
      router.push("/");
    })
    .catch((reason) => {
      message.value = "Authentication failed";
    });
}
</script>

<style>
</style>
