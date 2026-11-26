import { parse, stringify } from "yaml";
import {
  inflateByLang,
  pathJoin,
  withId,
  withoutId,
  type ByLang,
  type WithId,
} from "@/util";

/** Structure of lexicon config YAML */
export type LexiconConfig = {
  resource_id: string;
  name?: ByLang | string;
  description?: ByLang | string;
  fields: {
    collection: boolean;
    label: ByLang | string;
    name: string;
    required: boolean;
    type: LexiconFieldType;
  }[];
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
  fields: WithId<{
    collection: boolean;
    label: ByLang;
    name: string;
    required: boolean;
    type: LexiconFieldType;
  }>[];
  entryWord: {
    field: string;
    description: ByLang;
  };
};

export type LexiconFieldType = "text" | "integer" | "float" | "bool" | "object";

export const LEXICON_FIELD_TYPES: LexiconFieldType[] = [
  "text",
  "integer",
  "float",
  "bool",
  "object",
];

export function emptyConfig(): LexiconConfigOptions {
  return {
    fields: [createField("baseform")],
    entryWord: {
      field: "baseform",
      description: {},
    },
  };
}

export const createField = (name = ""): LexiconConfigOptions["fields"][0] =>
  withId({ name, label: {}, type: "text", collection: false, required: false });

/** Parse a lexicon config YAML string */
export function parseConfig(
  yaml: string,
  defaultLanguage: string,
): LexiconConfigOptions {
  const config = parse(yaml) as LexiconConfig;
  const { name, description, fields, karps } = config;
  return {
    name: name ? inflateByLang(name, defaultLanguage) : undefined,
    description: description
      ? inflateByLang(description, defaultLanguage)
      : undefined,
    fields: (fields || []).map((field) => ({
      ...withId(field),
      label: inflateByLang(field.label, defaultLanguage),
    })),
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
    fields: options.fields.map(withoutId),
    karps: {
      entry_word: options.entryWord,
      link,
    },
  };
  return stringify(config, { indentSeq: false });
}
