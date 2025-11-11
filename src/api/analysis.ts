import { once } from "es-toolkit";
import { ensureTrailingSlash } from "@/util";
import type { ByLang } from "@/util.types";

// TODO Remove?
export type AnnotationGroup =
  | "saldo"
  | "msd"
  | "syntax"
  | "readability"
  | "wsd"
  | "sensaldo"
  | "lexicalClasses"
  | "swener";

// TODO Remove?
export const baseAnalyses = [
  "sbx-swe-sentence-sparv-storsuc",
  "sbx-swe-tokenization-sparv-betterword",
];

// TODO Remove?
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

export type AnalysisId = string;

/** Suggested annotation definitions for each known analysis id. */
export const analysisAnnotations: Readonly<Record<AnalysisId, string[]>> = {
  "sbx-swe-compound-sparv-saldolemgram": ["<token>:saldo.complemgram"],
  "sbx-swe-compound-sparv-saldowords": ["<token>:saldo.compwf"],
  "sbx-swe-dependency-stanza-stanzasynt": [
    "<token>:stanza.dephead_ref as dephead",
    "<token>:stanza.deprel",
    "<token>:stanza.ref",
  ],
  "sbx-swe-geotagcontext-sparv": ["<sentence>:geo.geo_context as _geocontext"],
  "sbx-swe-lemgram-sparv-saldo": ["<token>:saldo.lemgram as lex"],
  "sbx-swe-lemmatization-sparv-saldo2": ["<token>:saldo.baseform2 as lemma"],
  "sbx-swe-lexical_classes_text-sparv-blingbring": [
    "<text>:lexical_classes.blingbring",
  ],
  "sbx-swe-lexical_classes_text-sparv-swefn": ["<text>:lexical_classes.swefn"],
  "sbx-swe-lexical_classes_token-sparv-blingbring": [
    "<token>:lexical_classes.blingbring",
  ],
  "sbx-swe-lexical_classes_token-sparv-swefn": [
    "<token>:lexical_classes.swefn",
  ],
  "sbx-swe-msd-stanza-stanzamorph-suc3": ["<token>:stanza.msd"],
  "sbx-swe-msd-stanza-stanzamorph-ufeats": ["<token>:stanza.ufeats"],
  "sbx-swe-namedentity-swener": [
    "swener.ne",
    "swener.ne:swener.name",
    "swener.ne:swener.ex",
    "swener.ne:swener.type",
    "swener.ne:swener.subtype",
  ],
  "sbx-swe-pos-stanza-stanzamorph": ["<token>:stanza.pos"],
  "sbx-swe-readability-sparv-lix": ["<text>:readability.lix"],
  "sbx-swe-readability-sparv-nk": ["<text>:readability.nk"],
  "sbx-swe-readability-sparv-ovix": ["<text>:readability.ovix"],
  "sbx-swe-sense-sparv": ["<token>:wsd.sense"],
  // "sbx-swe-sentence-sparv-storsuc": [""],
  "sbx-swe-sentiment-sparv-sensaldo": [
    "<token>:sensaldo.sentiment_score",
    "<token>:sensaldo.sentiment_label",
  ],
  // "sbx-swe-tokenization-sparv-betterword": [""],
};

/** Inverted annotation mapping: analysis id of each suggested annotation string. */
export const annotationAnalyses: Readonly<Record<string, AnalysisId>> =
  Object.fromEntries(
    Object.entries(analysisAnnotations).map(([analysis, annotations]) =>
      annotations.flatMap((annotation) => [annotation, analysis]),
    ),
  );

export const loadAnalysisMetdata = once(async () => {
  const urlRaw = import.meta.env.VITE_METADATA_URL;
  if (!urlRaw) throw new Error("Missing VITE_METADATA_URL");

  const url = ensureTrailingSlash(urlRaw);

  const response = await fetch(url + "analyses");
  const data = (await response.json()) as AnalysisMetadataResponse;
  return data.resources.filter(
    (resource) =>
      !resource.successors?.length &&
      !resource.collection &&
      resource.in_collections?.includes("sbx-swe-mink_analyses"),
  );
});

export type AnalysisMetadataResponse = {
  hits: number;
  resource_type: "analyses";
  resources: AnalysisMetadata[];
};

// Manually transcribed from https://github.com/spraakbanken/metadata/blob/main/schema/metadata.json
export type AnalysisMetadata = {
  id: AnalysisId;
  name: ByLang;
  description: ByLang;
  short_description: ByLang;
  unlisted?: boolean;
  successors?: string[];
  languages: { code: string; name: ByLang };
  analysis_unit: ByLang;
  in_collections?: string[];
  caveats?: ByLang;
  intended_uses?: ByLang;
  collection?: boolean;
  keywords?: ByLang[];
  task?: string;
};
