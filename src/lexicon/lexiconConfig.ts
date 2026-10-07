import { parse, stringify } from "yaml";
import { inflateByLang, pathJoin, type ByLang } from "@/util";

/** Structure of lexicon config YAML */
export type LexiconConfig = {
  resource_id: string;
  name?: ByLang | string;
  description?: ByLang | string;
  karps: {
    /** Identifies a field in the lexicon data and assigns a human-readable label */
    entry_word: {
      field: string;
      description: ByLang | string;
    };
    link: string;
  };
};

/** Frontend-internal format of a lexicon config */
export type LexiconConfigOptions = {
  name?: ByLang;
  description?: ByLang;
  entryWord: {
    field: string;
    description: ByLang;
  };
};

export function emptyConfig(): LexiconConfigOptions {
  return {
    entryWord: {
      field: "baseform",
      description: {},
    },
  };
}

/** Parse a lexicon config YAML string */
export function parseConfig(
  yaml: string,
  defaultLanguage: string,
): LexiconConfigOptions {
  const config = parse(yaml) as LexiconConfig;
  const { name, description, karps } = config;
  return {
    name: name ? inflateByLang(name, defaultLanguage) : undefined,
    description: description
      ? inflateByLang(description, defaultLanguage)
      : undefined,
    entryWord: {
      ...karps.entry_word,
      description: inflateByLang(karps.entry_word.description, defaultLanguage),
    },
  };
}

/** Create a lexicon config YAML string */
export function makeConfig(
  id: string,
  options: LexiconConfigOptions,
  minkUrl: string,
): string {
  // Build full URL to lexicon overview page
  const link = pathJoin(minkUrl, `/library/lexicon/${id}`);

  const config: LexiconConfig = {
    resource_id: id,
    name: options.name,
    description: options.description,
    karps: {
      entry_word: options.entryWord,
      link,
    },
  };
  return stringify(config, { indentSeq: false });
}
