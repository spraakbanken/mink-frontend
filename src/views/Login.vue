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
import router from "@/router";
import { authenticate } from "@/assets/api";

const username = ref("");
const password = ref("");
const message = ref(null);

const store = useStore();

async function submitLogin() {
  message.value = "Authenticating...";
  const success = await authenticate(username.value, password.value);
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
