export type CsvModel = {
  /** List of token attribute names (including "token" as the first one) */
  header: SparvTokenAttr[];
  /** List of "sentences" (structural attributes and a list of tokens) (not necessarily a full sentence) */
  sentences: CsvSentence[];
};

type SparvTokenAttr = { name: string; analysis?: string };

type CsvSentence = {
  /** A list of structural attribute values */
  structs: CsvStruct[];
  /** Positional attributes */
  tokens: SparvValues[][];
};

type CsvStruct = { struct: string; attrs: SparvAttr[] };

type SparvAttr = { name: string; value: SparvValues };

type SparvValues = SparvValue | SparvValue[];

export type SparvValue = {
  main: string;
  parts?: string[];
  score?: string;
};

export function parseCsv(csv: string): CsvModel {
  const lines = csv.split("\n");

  // Read header line as token attribute names, optionally with an analysis prefix (e.g. "stanza.pos")
  const header = (lines.shift()?.split("\t") || []).map((full) => {
    const [, , analysis, name] = full.match(/^((\S+)\.)?(\S+)$/) || [];
    return { analysis, name };
  });

  let sentence: CsvSentence = { structs: [], tokens: [] };
  const sentences: CsvSentence[] = [sentence];

  for (const line of lines) {
    // Comment line: parse a structural attribute and add to current sentence
    if (line.startsWith("#")) {
      // If the current sentence has tokens, start a new sentence
      if (sentence.tokens.length) {
        sentence = { structs: [], tokens: [] };
        sentences.push(sentence);
      }

      // Parse structural attribute
      const match = line.match(/^# (\S+)\.(\S+) = (.*)$/);
      const [, struct, name, value] = match || [];
      // Ignore non-matching lines
      if (!value) continue;

      // Find or create attribute list for the identified struct
      let attrs = sentence.structs.find((s) => s.struct == struct);
      if (!attrs) {
        attrs = { struct, attrs: [] };
        sentence.structs.push(attrs);
      }

      // Add attribute to current sentence struct
      attrs.attrs.push({ name, value: parseValue(value) });
      continue;
    }

    // Ordinary CSV line: each is a token of the current sentence
    const values = line.split("\t").map(parseValue);
    sentence.tokens.push(values);
  }

  return { header, sentences: sentences };
}

const parseValue = (value: string): SparvValues =>
  value.startsWith("|") && value.endsWith("|")
    ? value.slice(1, -1).split("|").map(parseValueEach)
    : parseValueEach(value);

function parseValueEach(value: string): SparvValue {
  let main = value;

  const [, mainNew, score] = value.match("(.*):([-0-9.e]+)$") || [];
  if (score) main = mainNew;

  const parts = main.split("+");

  return {
    main,
    parts: parts.length > 1 ? parts : undefined,
    score: score || undefined,
  };
}
