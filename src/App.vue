<template>
  <header class="bg-white border-b p-4 mb-2">
    <div class="container flex justify-between items-center flex-wrap">
      <div class="text-4xl">
        <router-link to="/" class="text-current">Min språkbank</router-link>
      </div>
      <div class="h-12 flex items-center">
        <div
          v-if="messages"
          class="
            messages
            mx-2
            self-start
            h-full
            overflow-auto
            text-right text-xs
          "
        >
          <div v-for="message in messages" :key="message">{{ message }}</div>
        </div>
        <div class="mx-2" v-if="messages">
          <Spinner />
        </div>
        <div class="ml-2 -mr-3 w-56">
          <a href="https://spraakbanken.gu.se/">
            <img src="@/assets/sbx1r.svg" />
          </a>
        </div>
      </div>
    </div>
  </header>
  <div class="container flex justify-between mb-4 text-gray-600">
    <div class="flex">
      <router-link to="/" class="text-gray-600">Korpusar</router-link>
    </div>
    <div class="flex">
      <router-link to="/user" class="text-gray-600">{{ name }}</router-link>
    </div>
  </div>
  <div class="container py-2">
    <router-view />
  </div>
  <div
    class="
      container
      py-20
      flex
      justify-center
      items-center
      text-sm text-gray-700
    "
  >
    Kontakt: sb-info@svenska.gu.se
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { initialize } from "./assets/api";
import store from "./store";
import { messages } from "@/assets/spin";
import Spinner from "@/components/Spinner.vue";

const auth = computed(() => store.state.auth);
const name = computed(() => store.state.auth?.username);

// Initialize API client.
if (auth.value) {
  initialize(auth.value.username, auth.value.password);
}
</script>

<style scoped>
.messages {
  scrollbar-width: none;
}
.messages::-webkit-scrollbar {
  width: 0;
}
</style>
