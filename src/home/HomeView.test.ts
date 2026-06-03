import { render } from "@testing-library/vue";
import { test } from "vitest";
import { createPinia } from "pinia";
import i18n from "@/i18n/i18n";
import HomeView from "@/home/HomeView.vue";
import router from "@/router/router";
import { formkit, formkitConfig } from "@/formkit";
import { injectionKeys } from "@/injection";

test("frontpage", () => {
  const pinia = createPinia();

  const config = {
    backendUrl: "TEST",
    auth: {
      apiUrl: "TEST",
    },
  };
  const { getByText } = render(HomeView, {
    global: {
      plugins: [i18n, router, pinia, [formkit, formkitConfig]],
      provide: {
        [injectionKeys.config]: config,
      },
    },
  });

  getByText("Sign in");
});
