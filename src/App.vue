<template>
  <header class="bg-white border-b mb-2">
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
      <!-- <router-link to="/user" class="text-gray-600 pt-0.5">Profile</router-link>
      <h4 class="pr-2 pl-2 text-xl">|</h4> -->
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
import { initialize } from "./assets/api";
import * as api from "./assets/api";
import { useStore } from "vuex";
import useSpin from "@/assets/spin";
import Spinner from "@/components/Spinner.vue";
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";

const store = useStore();
const { messages } = useSpin();

// Use the token for all API requests.
// Fetching JWT happens in router.beforeEach, see router.js.
watchEffect(() => {
  initialize(store.state.jwt);
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
