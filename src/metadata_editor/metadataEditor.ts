import Ajv2020 from "ajv/dist/2020";
import { memoize, once } from "es-toolkit";
import addFormats from "ajv-formats";

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

export async function loadValidator() {
  const response = await fetch(SCHEMA_URL);
  const schema = await response.json();
  const ajv = new Ajv2020();
  addFormats(ajv);
  return ajv.compile(schema);
}

export const loadValidatorOnce = once(loadValidator);

export async function loadTemplate(type: ResourceType) {
  const url = `https://raw.githubusercontent.com/spraakbanken/metadata/refs/heads/main/yaml_templates/${type}.yaml`;
  const response = await fetch(url);
  const json = await response.text();
  return json;
}

export const loadTemplateMemoized = memoize(loadTemplate);
