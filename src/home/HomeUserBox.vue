<script setup lang="ts">
import { PhSignOut, PhUserPlus } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import { useAuth } from "@/api/useAuth";
import LoginButton from "@/auth/LoginButton.vue";
import UrlButton from "@/components/UrlButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import { useJwtStore } from "@/store/jwt.store";

const auth = useAuth();
const { isAuthenticated, userName } = storeToRefs(useJwtStore());
</script>

<template>
  <div class="flex justify-center gap-6 p-6 text-center text-xl">
    <div v-if="!isAuthenticated">
      <LoginButton />
      <div class="my-2 text-base opacity-70">
        {{ $t("login.help") }}
      </div>
    </div>

    <div v-if="!isAuthenticated">
      <RouteButton to="/signup" class="button-success">
        <PhUserPlus weight="fill" class="inline mb-0.5 mr-1" />
        {{ $t("signup") }}
      </RouteButton>
      <div class="my-2 text-base opacity-70">
        {{ $t("signup.help") }}
      </div>
    </div>

    <div
      v-if="isAuthenticated"
      class="bg-sky-100 dark:bg-sky-900 p-4 rounded-sm shadow-inner flex flex-wrap justify-center items-baseline gap-4"
    >
      <div>{{ $t("welcome", { name: userName }) }}</div>

      <RouteButton to="/library" class="button-primary">
        {{ $t("mydata") }}
      </RouteButton>

      <UrlButton :href="auth.getLogoutUrl()">
        <PhSignOut class="inline mb-1 mr-1" />
        {{ $t("logout") }}
      </UrlButton>
    </div>
  </div>
</template>
