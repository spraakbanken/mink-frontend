<template>
  <h1>Min språkbank</h1>
  <h2>Logga in</h2>
  <div><input v-model="username" /></div>
  <div><input type="password" v-model="password" /></div>
  <div><input type="submit" @click="submitLogin" /></div>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { authenticate } from "@/assets/api";
import { spin } from "@/assets/spin";

const store = useStore();
const username = ref("");
const password = ref("");
const message = ref(null);

async function submitLogin() {
  const success = await spin(
    authenticate(username.value, password.value),
    "Loggar in"
  );
  if (success) {
    store.commit("login", {
      username: username.value,
      password: password.value,
    });
    router.push("/");
  } else {
    message.value = "Authentication failed";
  }
}
</script>

<style>
</style>
