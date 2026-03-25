import { useRoute } from "vue-router";

export default function useResourceIdParam() {
  const route = useRoute();
  return route.params.id as string;
}
