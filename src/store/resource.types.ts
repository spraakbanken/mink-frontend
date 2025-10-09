import type { ByLang } from "@/util.types";
import type { CorpusJob, FileMeta, ResourceType } from "@/api/api.types";

export type Resource<T extends ResourceType = ResourceType> = {
  type: T;
  name: ByLang;
  owner: User;
  job: CorpusJob;
  /** For Metadata, this can be different from the Mink id. */
  publicId: string;
  sources: FileMeta[];
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Corpus = Resource<"corpus">;
export type Lexicon = Resource<"lexicon">;
export type Metadata = Resource<"metadata">;

// User-defined type guards to help inform TypeScript
// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export const isCorpus = (resource: Resource): resource is Corpus =>
  resource.type == "corpus";
export const isLexicon = (resource: Resource): resource is Lexicon =>
  resource.type == "lexicon";
export const isMetadata = (resource: Resource): resource is Metadata =>
  resource.type == "metadata";
