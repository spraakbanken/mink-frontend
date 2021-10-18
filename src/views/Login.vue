<template>
  <PageTitle>Logga in</PageTitle>
  <Section ref="refForm">
    <div>
      <label for="username">Username:</label>
      <input id="username" v-model="username" class="border" />
    </div>

    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" v-model="password" class="border" />
    </div>

    <div>
      <ActionButton @click="submitLogin" class="bg-green-200 border-green-300">
        Logga in
      </ActionButton>
    </div>
  </Section>

  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { authenticate } from "@/assets/api";
import { spin } from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";

const store = useStore();
const username = ref("");
const password = ref("");
const message = ref(null);

async function submitLogin() {
  const success = await spin(
    authenticate(username.value, password.value),
    "Loggar in",
    refForm.value.$el
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
