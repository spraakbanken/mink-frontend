import { render } from "@testing-library/vue";
import { test } from "vitest";
import i18n from "@/i18n/i18n";
import HomeView from "./HomeView.vue";
import router from "@/router/router";
import { formkit, formkitConfig } from "@/formkit";
import { FontAwesomeIcon } from "@/fontawesome";

test("frontpage", () => {
  const { getByText } = render(HomeView, {
    global: {
      plugins: [i18n, router, [formkit, formkitConfig]],
      components: { icon: FontAwesomeIcon },
    },
  });

  getByText("Configurable language technology analysis");
});
