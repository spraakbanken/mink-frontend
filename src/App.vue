<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import SpinIndicator from "./spin/SpinIndicator.vue";
import { useJwtStore } from "./store/jwt.store";
import { injectComponent } from "./injection";
import AppHeader from "@/page/AppHeader.vue";
import { useApi } from "@/api/useApi";
import * as util from "@/util";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import AlertList from "@/alert/AlertList.vue";
import usePageTitle from "@/page/title.composable";
import BreadcrumbBar from "@/page/BreadcrumbBar.vue";

const api = useApi();
const { loadJwt } = useJwtStore();
useLocale();
// The `title` ref is automatically updated from route meta.
const { title } = usePageTitle();
// Activate automatic updates of the HTML page title.
useTitle(title, { titleTemplate: "%s | Mink" });
const route = useRoute();
const router = useRouter();
const resourceStore = useResourceStore();

const AppFooter = injectComponent(
  "AppFooter",
  () => import("@/page/AppFooter.vue"),
);

const isRouteLoading = ref(false);
const isHome = computed(() => route.path == "/");

// Fetch JWT and use it for all API requests.
loadJwt();

// Some route views are lazy-loaded and can take a moment to load.
router.beforeEach(() => {
  isRouteLoading.value = true;
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
  <AlertList />

  <div class="grow container py-2">
    <router-view />
    <SpinIndicator v-if="isRouteLoading" />
  </div>

  <AppFooter />
</template>
