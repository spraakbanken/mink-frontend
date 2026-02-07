<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { PhQuestion, PhUser } from "@phosphor-icons/vue";
import MinkLogo from "@/page/MinkLogo.vue";
import { getLogoutUrl } from "@/api/sbauth";
import { useAuth } from "@/auth/auth.composable";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
import SpinIndicator from "@/spin/SpinIndicator.vue";
import useSpin from "@/spin/spin.composable";

defineProps<{
  large: boolean;
}>();

const { isAuthenticated, canUserWrite, userName } = useAuth();
const route = useRoute();
const { isPending } = useSpin();

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
      class="container pt-4 pb-2 flex max-sm:flex-col flex-wrap sm:items-baseline-last gap-4"
    >
      <!-- Logo -->
      <component
        :is="isHome ? 'h1' : 'div'"
        class="text-4xl min-w-max"
        :class="large ? 'h-24' : 'h-16'"
      >
        <router-link to="/" class="text-current" :title="$t('home')">
          <MinkLogo :large="large" />
        </router-link>
      </component>

      <!-- Main navigation -->
      <div
        class="flex sm:max-lg:flex-col gap-x-4 items-start text-nowrap"
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
          to="/metadata-editor"
          class="no-underline hover:underline"
          :class="isActiveClass('/metadata-editor')"
        >
          {{ $t("metadata_editor") }}
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
            v-if="canUserWrite"
            to="/user"
            class="no-underline hover:underline"
            :class="isActiveClass('/user')"
          >
            <PhUser class="inline mb-0.5 mr-1" />{{ userName }}
          </router-link>
          <a v-else :href="getLogoutUrl()" class="no-underline hover:underline">
            <PhUser class="inline mb-0.5 mr-1" />{{ $t("logout") }}
          </a>
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
