<template>
  <header class="bg-white mb-2 shadow-md">
    <div class="container py-4 flex justify-between items-center flex-wrap">
      <div class="text-4xl">
        <router-link to="/" class="text-current">Mink</router-link>
      </div>
      <div class="h-12 flex items-center">
        <div
          v-if="messages"
          class="messages mx-2 self-start h-full overflow-auto text-right text-xs"
        >
          <div v-for="message in messages" :key="message">{{ message }}</div>
        </div>
        <div v-if="messages" class="mx-2">
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
      <router-link to="/" class="text-gray-600 pt-1">{{
        $t("corpuses")
      }}</router-link>
    </div>
    <div class="flex">
      <template v-if="payload">
        <router-link to="/user" class="text-gray-600 pt-0.5">
          {{ payload.name }}
        </router-link>
        <span class="pr-2 pl-2 text-xl">|</span>
      </template>
      <LocaleSwitcher />
    </div>
  </div>
  <div class="container py-2">
    <router-view />
  </div>
  <div
    class="container py-20 flex justify-center items-center text-sm text-gray-700"
  >
    {{ $t("contact") }}: sb-info@svenska.gu.se
  </div>
</template>

<script setup>
import { watchEffect } from "@vue/runtime-core";
import { api } from "./assets/api";
import { useStore } from "vuex";
import useSpin from "@/assets/spin";
import Spinner from "@/components/Spinner.vue";
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import { useJwt } from "./composables/jwt";

const store = useStore();
const { messages } = useSpin();
const { jwt, payload } = useJwt();

// Use the token for all API requests.
// Fetching JWT happens in router.beforeEach, see router.js.
watchEffect(() => {
  api.setJwt(jwt.value);
});

if (import.meta.env.DEV) {
  window.state = store.state;
  window.api = api;
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
