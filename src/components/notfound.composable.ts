import { isAxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";

export default function useNotFound() {
  const router = useRouter();
  const route = useRoute();

  function showNotFoundPage() {
    router.push({
      name: "notfound",
      params: { pathMatch: route.path.substring(1).split("/") },
    });
  }

  return {
    /** Handle an Axios 404 error, rethrow others */
    handle404(reason: unknown) {
      if (isAxiosError(reason) && reason.status == 404) showNotFoundPage();
      else throw reason;
    },

    /** Redirect to the "Page not found" route without changing the URL */
    showNotFoundPage,
  };
}
