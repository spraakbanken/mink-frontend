<template>
  <AppHeader :large="isHome" />
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import { api } from "@/api/api";
import { useAuth } from "@/auth/auth.composable";
import useLocale from "@/i18n/locale.composable";
import MessageToasts from "@/message/MessageToasts.vue";
// Asset path transformation doesn't work in <source srcset> like in <img src>
import usePageTitle from "@/page/title.composable";
import Breadcrumb from "@/page/Breadcrumb.vue";
import AppHeader from "./page/AppHeader.vue";

const { refreshJwt } = useAuth();
useLocale();
// The `title` ref is automatically updated from route meta.
const { title } = usePageTitle();
// Activate automatic updates of the HTML page title.
useTitle(title, { titleTemplate: "%s | Mink" });
const route = useRoute();

const isHome = computed(() => route.path == "/");

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

<style scoped></style>
