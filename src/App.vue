<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import SpinIndicator from "./spin/SpinIndicator.vue";
import AppFooter from "./page/AppFooter.vue";
import AppHeader from "@/page/AppHeader.vue";
import api from "@/api/api";
import * as util from "@/util";
import { useAuth } from "@/auth/auth.composable";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import MessageToasts from "@/message/MessageToasts.vue";
import usePageTitle from "@/page/title.composable";
import BreadcrumbBar from "@/page/BreadcrumbBar.vue";

const { refreshAuth } = useAuth();
useLocale();
// The `title` ref is automatically updated from route meta.
const { title } = usePageTitle();
// Activate automatic updates of the HTML page title.
useTitle(title, { titleTemplate: "%s | Mink" });
const route = useRoute();
const router = useRouter();
const resourceStore = useResourceStore();

const isRouteLoading = ref(false);
const isHome = computed(() => route.path == "/");

// Fetch JWT and use it for all API requests.
refreshAuth();

// Some route views are lazy-loaded and can take a moment to load.
router.beforeEach((to, from, next) => {
  isRouteLoading.value = true;
  next();
});
router.afterEach(() => {
  isRouteLoading.value = false;
});

if (import.meta.env.DEV) {
  window.api = api;
  window.resourceStore = resourceStore;
  window.util = util;
}
</script>

<template>
  <AppHeader :large="isHome" />
  <BreadcrumbBar />
  <MessageToasts />

  <div class="flex-grow container py-2">
    <router-view />
    <SpinIndicator v-if="isRouteLoading" />
  </div>

  <AppFooter />
</template>
