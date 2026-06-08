import { emptyConfig, makeConfig } from "./config/lexiconConfig";
import { useAppConfig } from "@/app/useAppConfig";
import useCreateResource from "@/resource/createResource.composable";

export function useCreateLexicon() {
  const { minkUrl } = useAppConfig();
  const { createResource } = useCreateResource();

  async function createLexicon(name = "", files: File[] = []) {
    const configOptions = {
      ...emptyConfig(),
      name: { swe: name, eng: name },
    };
    return createResource(
      "lexicon",
      (id) => makeConfig(id, configOptions, minkUrl),
      files,
    );
  }

  return {
    createLexicon,
  };
}
