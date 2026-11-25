export type Model = {
  /** List of token attribute names (including "token" as the first one) */
  header: string[];
  /** List of "sentences" (structural attributes and a list of tokens) (not necessarily a full sentence) */
  sentences: Sentence[];
};

type Sentence = {
  /** A list of structural attribute values */
  structs: Struct[];
  /** Positional attributes */
  tokens: Value[][];
};

type Struct = { struct: string; attrs: Attribute[] };
type Attribute = { name: string; value: Value };

type Value = string | string[];

export function parseCsv(csv: string): Model {
  const lines = csv.split("\n");
  const header = lines.shift()?.split("\t") || [];

  let sentence: Sentence = { structs: [], tokens: [] };
  const sentences: Sentence[] = [sentence];

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

const parseValue = (value: string): Value =>
  value.startsWith("|") && value.endsWith("|")
    ? value.slice(1, -1).split("|")
    : value;
