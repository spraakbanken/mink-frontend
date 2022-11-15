<template>
  <header class="bg-white mb-2 shadow">
    <div class="container py-4 flex justify-between flex-wrap gap-4">
      <div class="text-4xl">
        <router-link to="/" class="text-current">
          <img src="@/assets/mink.svg" alt="Mink" class="h-16" />
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <div
          v-if="messages"
          class="messages hidden md:block h-12 overflow-auto text-right text-xs"
        >
          <div v-for="message in messages" :key="message">{{ message }}</div>
        </div>

        <Spinner
          class="hidden sm:block h-12"
          :class="{ 'opacity-0': !messages }"
        />

        <div class="self-stretch flex flex-col">
          <div class="w-56 flex-1">
            <a href="https://spraakbanken.gu.se/">
              <img src="@/assets/sbx1r.svg" />
            </a>
          </div>

          <div class="mt-2 flex flex-wrap gap-4 items-baseline justify-end">
            <template v-if="payload">
              <router-link to="/user" class="text-gray-600 pt-0.5">
                {{ payload.name }}
              </router-link>
            </template>

            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </div>

    <AdminModeBanner />
  </header>

  <MessageToasts />

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
import { useStore } from "vuex";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import { useJwt } from "@/composables/jwt";
import useMessenger from "@/composables/messenger";
import Spinner from "@/components/Spinner.vue";
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import AdminModeBanner from "@/components/AdminModeBanner.vue";
import MessageToasts from "@/components/MessageToasts.vue";

const store = useStore();
const { messages } = useSpin();
const { refreshJwt, payload } = useJwt();
const { alert } = useMessenger();

// Fetch JWT and use it for all API requests.
refreshJwt();

api.setResponseHandler(
  (data) => data.message && alert(data.message, data.status)
);

if (import.meta.env.DEV) {
  window.state = store.state;
  window.api = api;
  import("@/util").then((m) => (window.util = m));
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
