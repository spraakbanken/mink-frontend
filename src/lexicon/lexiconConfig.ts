import { parse, stringify } from "yaml";
import type { ByLang } from "@/util.types";
import { pathJoin } from "@/util";

/** Structure of lexicon config YAML */
export type LexiconConfig = {
  resource_id: string;
  name?: ByLang;
  description?: ByLang;
  karps: { link: string };
};

/** Frontend-internal format of a lexicon config */
export type LexiconConfigOptions = {
  name?: ByLang;
  description?: ByLang;
};

export function emptyConfig(): LexiconConfigOptions {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
  };
}

/** Parse a lexicon config YAML string */
export function parseConfig(yaml: string): LexiconConfigOptions {
  const config = parse(yaml) as LexiconConfig;
  const { name, description } = config;
  return {
    name,
    description,
  };
}

/** Create a lexicon config YAML string */
export function makeConfig(id: string, options: LexiconConfigOptions): string {
  const link = createLink(id);

  const config: LexiconConfig = {
    ...options,
    resource_id: id,
    karps: { link },
  };
  return stringify(config, { indentSeq: false });
}

/** Build full URL to lexicon overview page */
const createLink = (id: string): string =>
  pathJoin(import.meta.env.VITE_MINK_URL, `/library/lexicon/${id}`);
