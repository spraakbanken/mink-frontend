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
</script>

<template>
  <header class="mb-2 shadow-sm bg-white dark:bg-zinc-800">
    <div
      class="container pt-4 pb-2 flex justify-between items-baseline-last gap-4"
    >
      <!-- Logo -->
      <component
        :is="isHome ? 'h1' : 'div'"
        class="text-4xl min-w-max"
        :class="large ? 'h-24' : 'h-16'"
      >
        <router-link to="/" class="text-current">
          <MinkLogo :large="large" />
        </router-link>
      </component>

      <SpinIndicator v-if="isAuthenticating" />

      <!-- Navigation -->
      <div
        class="flex max-md:flex-col gap-x-4 items-baseline justify-end text-end text-nowrap"
      >
        <template v-if="isAuthenticated">
          <router-link
            v-if="canUserWrite"
            to="/user"
            class="no-underline hover:underline"
          >
            <PhUser class="inline mb-0.5 mr-1" />{{ userName }}
          </router-link>
          <a v-else :href="getLogoutUrl()" class="no-underline hover:underline">
            <PhUser class="inline mb-0.5 mr-1" />{{ $t("logout") }}
          </a>
        </template>

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

    <AdminModeBanner />
  </header>
</template>
