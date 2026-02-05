import { memoize } from "es-toolkit";

const SCHEMA_URL =
  "https://raw.githubusercontent.com/spraakbanken/metadata/refs/heads/main/schema/metadata.json";

export enum ResourceType {
  analysis = "analysis",
  collection = "collection",
  corpus = "corpus",
  lexicon = "lexicon",
  model = "model",
  utility = "utility",
}

export async function loadMetadataSchema() {
  const response = await fetch(SCHEMA_URL);
  return await response.json();
}

export async function loadTemplate(type: ResourceType) {
  const url = `https://raw.githubusercontent.com/spraakbanken/metadata/refs/heads/main/yaml_templates/${type}.yaml`;
  const response = await fetch(url);
  const json = await response.text();
  return json;
}

export const loadTemplateMemoized = memoize(loadTemplate);
