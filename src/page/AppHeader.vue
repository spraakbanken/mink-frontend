<script setup>
import { getLogoutUrl } from "@/auth/auth";
import { useAuth } from "@/auth/auth.composable";
import LocaleSwitcher from "@/i18n/LocaleSwitcher.vue";
import AdminModeBanner from "@/user/AdminModeBanner.vue";
// Asset path transformation doesn't work in <source srcset> like in <img src>
import logoMinkLight from "@/assets/mink-light.svg";
import logoSbxLight from "@/assets/sbx1r-light.svg";
import Spinner from "@/spin/Spinner.vue";

const { isAuthenticating, payload, canUserWrite } = useAuth();
</script>

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
        <Spinner v-if="isAuthenticating" />
        <div class="self-stretch flex flex-col">
          <div class="w-56 flex-1">
            <a href="https://spraakbanken.gu.se/">
              <picture>
                <source
                  media="(prefers-color-scheme: dark)"
                  :srcset="logoSbxLight"
                />
                <img src="@/assets/sbx1r.svg" alt="Språkbanken Text" />
              </picture>
            </a>
          </div>

          <div class="mt-2 flex flex-wrap gap-4 items-baseline justify-end">
            <template v-if="payload">
              <router-link v-if="canUserWrite" to="/user" class="text-inherit">
                {{ payload.name }}
              </router-link>
              <a v-else :href="getLogoutUrl()" class="text-inherit">
                {{ $t("logout") }}
              </a>
            </template>

            <LocaleSwitcher />
          </div>
        </div>

        <div class="-my-4">
          <a href="https://gu.se/">
            <img
              src="@/assets/gu_logo_sv.png"
              alt="Göteborgs universitet"
              class="h-24"
            />
          </a>
        </div>
      </div>
    </div>

    <AdminModeBanner />
  </header>
</template>
