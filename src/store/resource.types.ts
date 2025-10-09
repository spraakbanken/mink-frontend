import type { ByLang } from "@/util.types";
import type { CorpusJob, FileMeta, ResourceType } from "@/api/api.types";

export type Resource = {
  type: ResourceType;
  name: ByLang;
  owner: User;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Corpus = Resource & {
  type: "corpus";
  sources: FileMeta[];
  config?: string;
  job: CorpusJob;
  exports?: FileMeta[];
};

export type Lexicon = Resource & {
  type: "lexicon";
};

export type Metadata = Resource & {
  type: "metadata";
  publicId: string;
  metadata: string; // YAML
};

// User-defined type guards to help inform TypeScript
// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export const isCorpus = (
  resource: Partial<Resource>,
): resource is Partial<Corpus> => resource.type == "corpus";
export const isLexicon = (resource: Partial<Resource>): resource is Lexicon =>
  resource.type == "lexicon";
export const isMetadata = (
  resource: Partial<Resource>,
): resource is Partial<Metadata> => resource.type == "metadata";
