import { useI18n } from "vue-i18n";
import { emptyConfig, makeConfig } from "./lexiconConfig";
import { useAppConfig } from "@/app/useAppConfig";
import useLocale from "@/i18n/locale.composable";
import useCreateResource from "@/resource/createResource.composable";

export function useCreateLexicon() {
  const { minkUrl } = useAppConfig();
  const { createResource } = useCreateResource();
  const { t } = useI18n();
  const { createByLang, locale3 } = useLocale();

  async function createLexicon(name = "", files: File[] = []) {
    const configOptions = {
      ...emptyConfig(),
      name: createByLang(name),
    };

    // Set default entry word description in the current language
    configOptions.entryWord.description[locale3.value] = t(
      "lexicon.config.entry_word.description.default",
    );

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
