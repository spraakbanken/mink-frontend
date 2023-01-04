<template>
  <header
    class="mb-2 shadow bg-white text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
  >
    <div class="container py-4 flex justify-between flex-wrap gap-4">
      <div class="text-4xl">
        <router-link to="/" class="text-current">
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              :srcset="logoMinkLight"
            />
            <img src="@/assets/mink.svg" alt="Mink" class="h-16" />
          </picture>
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
              <picture>
                <source
                  media="(prefers-color-scheme: dark)"
                  :srcset="logoSbxLight"
                />
                <img src="@/assets/sbx1r.svg" />
              </picture>
            </a>
          </div>

          <div class="mt-2 flex flex-wrap gap-4 items-baseline justify-end">
            <template v-if="payload">
              <router-link to="/user" class="text-inherit pt-0.5">
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
    class="container py-20 flex justify-center items-center text-sm opacity-70"
  >
    {{ $t("contact") }}: sb-info@svenska.gu.se
  </div>
</template>

<script setup>
import { api } from "@/api/api";
import { useCorpusStore } from "@/store/corpus.store";
import useSpin from "@/spin/spin.composable";
import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";
import Spinner from "@/spin/Spinner.vue";
import useLocale from "@/i18n/locale.composable";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
import MessageToasts from "@/message/MessageToasts.vue";
// Asset path transformation doesn't work in <source srcset> like in <img src>
import logoMinkLight from "@/assets/mink-light.svg";
import logoSbxLight from "@/assets/sbx1r-light.svg";

const { messages } = useSpin();
const { refreshJwt, payload } = useAuth();
const { alert } = useMessenger();
useLocale();

// Fetch JWT and use it for all API requests.
refreshJwt();

api.setResponseHandler(
  (data) => data.message && alert(data.message, data.status)
);

if (import.meta.env.DEV) {
  window.corpusStore = useCorpusStore();
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
