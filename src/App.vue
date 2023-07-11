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

  <Breadcrumb />
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
import { useTitle } from "@vueuse/core";
import { api } from "@/api/api";
import useSpin from "@/spin/spin.composable";
import { useAuth } from "@/auth/auth.composable";
import Spinner from "@/spin/Spinner.vue";
import useLocale from "@/i18n/locale.composable";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
import MessageToasts from "@/message/MessageToasts.vue";
// Asset path transformation doesn't work in <source srcset> like in <img src>
import logoMinkLight from "@/assets/mink-light.svg";
import logoSbxLight from "@/assets/sbx1r-light.svg";
import usePageTitle from "./title.composable";
import Breadcrumb from "./Breadcrumb.vue";

const { messages } = useSpin();
const { refreshJwt, payload } = useAuth();
useLocale();
const { title } = usePageTitle();
useTitle(title, { titleTemplate: "%s | Mink" });

// Fetch JWT and use it for all API requests.
refreshJwt();

if (import.meta.env.DEV) {
  window.api = api;
  import("@/store/corpus.store").then(
    (m) => (window.corpusStore = m.useCorpusStore())
  );
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
