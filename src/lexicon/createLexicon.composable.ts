import { useRouter } from "vue-router";
import { emptyConfig, makeConfig } from "./lexiconConfig";
import api from "@/api/api";
import { useAuth } from "@/auth/auth.composable";

export default function useCreateLexicon() {
  const { refreshAuth } = useAuth();
  const router = useRouter();

  async function createLexicon(name: string) {
    const id = await api.createLexicon();
    // Have the new corpus included in further API calls.
    await refreshAuth();

    const configOptions = {
      ...emptyConfig(),
      name: { swe: name, eng: name },
    };

    await api.uploadLexiconConfig(id, makeConfig(configOptions));

    // Show the created resource.
    router.push(`/library/lexicon/${id}`);
  }

  return {
    createLexicon,
  };
}
