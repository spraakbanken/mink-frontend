import type { ByLang } from "@/util.types";
import type { CorpusStatus, FileMeta, ResourceType } from "@/api/api.types";

export type Resource = {
  type: ResourceType;
  name: ByLang;
  owner?: User;
};

export type User = {
  name: string;
  id: string;
};

export type Corpus = Resource & {
  type: "corpus";
  sources: FileMeta[];
  config?: string;
  status: CorpusStatus;
  exports?: FileMeta[];
};

export type Metadata = Resource & {
  publicId: string;
  metadata: string; // YAML
};

// User-defined type guards to help inform TypeScript
// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export const isCorpus = (resource: Partial<Resource>): resource is Corpus =>
  resource.type == "corpus";
export const isMetadata = (resource: Partial<Resource>): resource is Metadata =>
  resource.type == "metadata";
