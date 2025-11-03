export type AnnotationGroup =
  | "saldo"
  | "msd"
  | "syntax"
  | "readability"
  | "wsd"
  | "sensaldo"
  | "lexicalClasses"
  | "swener";

export const baseAnalyses = [
  "sbx-swe-sentence-sparv-storsuc",
  "sbx-swe-tokenization-sparv-betterword",
];

export const analysisListing: Record<AnnotationGroup, string[]> = {
  saldo: [
    "sbx-swe-compound-sparv-saldolemgram",
    "sbx-swe-compound-sparv-saldowords",
    "sbx-swe-lemgram-sparv-saldo",
    "sbx-swe-lemmatization-sparv-saldo2",
  ],
  msd: [
    "sbx-swe-msd-stanza-stanzamorph-suc3",
    "sbx-swe-msd-stanza-stanzamorph-ufeats",
    "sbx-swe-pos-stanza-stanzamorph",
  ],
  syntax: ["sbx-swe-dependency-stanza-stanzasynt"],
  readability: [
    "sbx-swe-readability-sparv-lix",
    "sbx-swe-readability-sparv-nk",
    "sbx-swe-readability-sparv-ovix",
  ],
  wsd: ["sbx-swe-sense-sparv"],
  sensaldo: ["sbx-swe-sentiment-sparv-sensaldo"],
  lexicalClasses: [
    "sbx-swe-lexical_classes_text-sparv-blingbring",
    "sbx-swe-lexical_classes_text-sparv-swefn",
    "sbx-swe-lexical_classes_token-sparv-blingbring",
    "sbx-swe-lexical_classes_token-sparv-swefn",
  ],
  swener: ["sbx-swe-namedentity-swener", "sbx-swe-geotagcontext-sparv"],
};
