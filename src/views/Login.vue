<template>
  <PageTitle>Logga in</PageTitle>
  <Section>
    <PendingContent on="login">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" class="border" />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="border"
        />
      </div>

      <div>
        <ActionButton
          @click="submitLogin"
          class="bg-green-200 border-green-300"
        >
          Logga in
        </ActionButton>
      </div>
    </PendingContent>
  </Section>

  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { authenticate } from "@/assets/api";
import useSpin from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import PendingContent from "@/components/PendingContent.vue";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";

const store = useStore();
const username = ref("");
const password = ref("");
const message = ref(null);
const { spin } = useSpin();

async function submitLogin() {
  const success = await spin(
    authenticate(username.value, password.value),
    "Loggar in",
    "login"
  );
  if (success) {
    store.commit("login", {
      username: username.value,
      password: password.value,
    });
    router.push("/");
  } else {
    message.value = "Authentication failed";
  }
}
</script>

<style></style>
