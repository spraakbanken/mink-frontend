export type Model = {
  header: string[];
  sentences: Sentence[];
};

type Sentence = {
  /** A list of structural attribute values */
  struct: Attribute[];
  /** Positional attributes */
  tokens: Value[][];
};

type Attribute = { name: string; value: Value };

type Value = string | string[];

export function parseCsv(csv: string): Model {
  const lines = csv.split("\n");
  const header = lines.shift()?.split("\t") || [];

  let sentence: Sentence = { struct: [], tokens: [] };
  const sentences: Sentence[] = [sentence];

  for (const line of lines) {
    // Comment line: parse a structural attribute and add to current sentence
    if (line.startsWith("#")) {
      // If the current sentence has tokens, start a new sentence
      if (sentence.tokens.length) {
        sentence = { struct: [], tokens: [] };
        sentences.push(sentence);
      }
      const match = line.match(/^# (\S+) = (.*)$/);
      const [, name, value] = match || [];
      if (value) sentence.struct.push({ name, value: parseValue(value) });
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
