import { render } from "@testing-library/vue";
import { test } from "vitest";
import i18n from "@/i18n/i18n";
import Home from "./Home.vue";
import router from "@/router";
import { FontAwesomeIcon } from "@/fontawesome";

test("frontpage", () => {
  const { getByText } = render(Home, {
    global: {
      plugins: [i18n, router],
      components: { icon: FontAwesomeIcon },
    },
  });

  getByText("Configurable language technology analysis");
});
