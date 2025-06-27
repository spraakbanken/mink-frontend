<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { PhQuestion, PhUser } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import MinkLogo from "@/page/MinkLogo.vue";
import { logoutUrl } from "@/auth/sbAuth";
import { useAuth } from "@/auth/auth.composable";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
import logoSbx from "@/assets/sprakbankentext.svg";
import logoSbxLight from "@/assets/sprakbankentext-light.svg";
import logoGu from "@/assets/gu-logo-sv.svg";
import logoGuEn from "@/assets/gu-logo-en.svg";
import logoGuLight from "@/assets/gu-logo-light-sv.svg";
import logoGuLightEn from "@/assets/gu-logo-light-en.svg";
import SpinIndicator from "@/spin/SpinIndicator.vue";
import ColorSchemeImage from "@/components/ColorSchemeImage.vue";

defineProps<{
  large: boolean;
}>();

const { isAuthenticated, isAuthenticating, canUserWrite, userName } = useAuth();
const { locale } = useI18n();

const route = useRoute();
const isHome = computed(() => route.path == "/");
</script>

<template>
  <header class="mb-2 shadow-sm bg-white dark:bg-zinc-800">
    <div
      class="container pt-4 pb-2 flex justify-between items-baseline-last flex-wrap gap-8"
    >
      <component
        :is="isHome ? 'h1' : 'div'"
        class="basis-1 grow text-4xl min-w-max"
        :class="large ? 'h-24' : 'h-16'"
      >
        <router-link to="/" class="text-current">
          <MinkLogo :large="large" />
        </router-link>
      </component>

      <div
        class="basis-1 grow flex flex-wrap gap-x-4 items-baseline justify-end lg:justify-center text-end text-nowrap"
      >
        <SpinIndicator v-if="isAuthenticating" />

        <template v-if="isAuthenticated">
          <router-link
            v-if="canUserWrite"
            to="/user"
            class="no-underline hover:underline"
          >
            <PhUser class="inline-block mb-0.5"></PhUser>
            {{ userName }}
          </router-link>
          <a v-else :href="logoutUrl" class="no-underline hover:underline">
            <PhUser class="inline-block mb-0.5"></PhUser>
            {{ $t("logout") }}
          </a>
        </template>

        <a
          :href="$t('docs.url')"
          target="_blank"
          class="no-underline hover:underline"
        >
          <PhQuestion class="inline-block mb-0.5"></PhQuestion>
          {{ $t("docs.label") }}
        </a>

        <LocaleSwitcher />
      </div>

      <div class="basis-1 grow hidden lg:flex justify-end items-end gap-4">
        <div class="w-56">
          <a href="https://spraakbanken.gu.se/">
            <ColorSchemeImage
              alt="Språkbanken Text"
              :src="logoSbx"
              :src-light="logoSbxLight"
            />
          </a>
        </div>

        <a href="https://gu.se/" class="min-w-max">
          <ColorSchemeImage
            :alt="$t('logo.gu.alt')"
            :src="{ sv: logoGu, en: logoGuEn }[locale]!"
            :src-light="{ sv: logoGuLight, en: logoGuLightEn }[locale]!"
            :class="[large ? 'h-24' : 'h-16']"
          />
        </a>
      </div>
    </div>

    <AdminModeBanner />
  </header>
</template>
