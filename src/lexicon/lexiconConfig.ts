import { parse, stringify } from "yaml";
import type { ByLang } from "@/util.types";

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

export function parseConfig(yaml: string): LexiconConfigOptions {
  return parse(yaml);
}

export function makeConfig(options: LexiconConfigOptions): string {
  return stringify(options, { indentSeq: false });
}
