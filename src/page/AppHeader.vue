<script setup lang="ts">
import { computed, defineAsyncComponent, inject } from "vue";
import { useRoute } from "vue-router";
import { PhQuestion, PhUser } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
import SpinIndicator from "@/spin/SpinIndicator.vue";
import useSpin from "@/spin/spin.composable";
import { useJwtStore } from "@/store/jwt.store";
import { injectionKeys } from "@/injection";
import { useAppConfig } from "@/app/useConfig";

defineProps<{
  large: boolean;
}>();

const { tools } = useAppConfig();
const { isAuthenticated, userName } = storeToRefs(useJwtStore());
const route = useRoute();
const { isPending } = useSpin();

const MinkLogo = inject(
  injectionKeys.component.MinkLogo,
  defineAsyncComponent(() => import("@/page/MinkLogo.vue")),
);

const isHome = computed(() => route.path == "/");
const isAuthenticating = computed(() => isPending("jwt"));

/** Replacement for the RouterLink `active-class` prop, because it only checks route nesting, not the path string. */
const isActiveClass = (path: string) =>
  route.path.startsWith(path) ? "text-sborange-600" : "";
</script>

<template>
  <header class="mb-2 shadow-sm bg-white dark:bg-zinc-800">
    <!-- Main row -->
    <div
      class="container pt-4 pb-2 flex max-sm:flex-col flex-wrap sm:items-baseline-last gap-4 gap-y-2"
    >
      <!-- Logo -->
      <component
        :is="isHome ? 'h1' : 'div'"
        class="text-4xl min-w-max mr-8 max-sm:mb-2"
        :class="large ? 'h-24' : 'h-16'"
      >
        <router-link to="/" class="text-current" :title="$t('home')">
          <MinkLogo :large />
        </router-link>
      </component>

      <!-- Main navigation -->
      <div
        class="flex sm:max-lg:flex-col gap-x-4 items-start text-nowrap text-lg font-medium"
      >
        <router-link
          to="/"
          class="no-underline hover:underline"
          exact-active-class="text-sborange-600"
        >
          {{ $t("home") }}
        </router-link>

        <router-link
          to="/library"
          class="no-underline hover:underline"
          :class="isActiveClass('/library')"
        >
          {{ $t("library") }}
        </router-link>

        <router-link
          v-if="tools.length"
          to="/tools"
          class="no-underline hover:underline"
          :class="isActiveClass('/tools')"
        >
          {{ $t("tools") }}
        </router-link>
      </div>

      <!-- Spacing spinner in the middle, always taking space, but visible only while auth is loading -->
      <SpinIndicator
        class="max-sm:hidden grow mx-auto"
        :class="{ invisible: !isAuthenticating }"
      />

      <div class="flex sm:max-lg:flex-col gap-x-4 text-nowrap">
        <!-- User link if logged in -->
        <template v-if="isAuthenticated">
          <router-link
            to="/user"
            class="no-underline hover:underline"
            :class="isActiveClass('/user')"
          >
            <PhUser class="inline mb-0.5 mr-1" />{{ userName }}
          </router-link>
        </template>

        <!-- Help link -->
        <a
          :href="$t('docs.url')"
          target="_blank"
          class="no-underline hover:underline"
        >
          <PhQuestion class="inline mb-0.5 mr-1" />{{ $t("docs.label") }}
        </a>

        <LocaleSwitcher />
      </div>
    </div>

    <!-- Admin mode banner row -->
    <AdminModeBanner />
  </header>
</template>
