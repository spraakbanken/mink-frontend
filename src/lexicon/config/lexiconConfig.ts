import { parse, stringify } from "yaml";
import type { ByLang } from "@/util.types";
import { pathJoin } from "@/util";

/** Structure of lexicon config YAML */
export type LexiconConfig = {
  resource_id: string;
  name?: ByLang;
  description?: ByLang;
  karps: {
    entry_word: LexiconField;
    link: string;
  };
};

/** Frontend-internal format of a lexicon config */
export type LexiconConfigOptions = {
  name?: ByLang;
  description?: ByLang;
  entryWord: LexiconField;
};

/** Identifies a field in the lexicon data and assigns a human-readable label */
export type LexiconField = {
  field: string;
  description: ByLang;
};

export function emptyConfig(): LexiconConfigOptions {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
    entryWord: {
      field: "baseform",
      description: { swe: "grundform", eng: "baseform" },
    },
  };
}

/** Parse a lexicon config YAML string */
export function parseConfig(yaml: string): LexiconConfigOptions {
  const config = parse(yaml) as LexiconConfig;
  const { name, description, karps } = config;
  return {
    name,
    description,
    entryWord: karps.entry_word,
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
