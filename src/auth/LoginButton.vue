<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { PhSignIn } from "@phosphor-icons/vue";
import { whenever } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useAuth } from "@/api/useAuth";
import UrlButton from "@/components/UrlButton.vue";
import { useJwtStore } from "@/store/jwt.store";

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const { isAuthenticated } = storeToRefs(useJwtStore());

whenever(isAuthenticated, () => {
  const destination = route.query.destination as string;
  router.push(destination || "/library");
});
</script>

<template>
  <UrlButton
    class="button-primary"
    :href="auth.getLoginUrl((route.query.destination as string) || '/library')"
  >
    <PhSignIn weight="bold" class="inline mb-1 mr-1" />
    {{ $t("login") }}
  </UrlButton>
</template>
