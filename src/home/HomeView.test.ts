import { render } from "@testing-library/vue";
import { test } from "vitest";
import { createPinia } from "pinia";
import i18n from "@/i18n/i18n";
import HomeView from "@/home/HomeView.vue";
import router from "@/router/router";
import { formkit, formkitConfig } from "@/formkit";

test("frontpage", () => {
  const pinia = createPinia();

  const { getByText } = render(HomeView, {
    global: {
      plugins: [i18n, router, pinia, [formkit, formkitConfig]],
    },
  });

  getByText("Configurable language technology analysis");
});
