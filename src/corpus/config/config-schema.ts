import type { JSONSchema7 } from "json-schema";
import { schemaWalk } from "@cloudflare/json-schema-walker";
import capitalize from "lodash/capitalize";
import type { VueI18n } from "vue-i18n";
import type { UiSchema } from "@rjsf/utils";
import cloneDeep from "lodash/cloneDeep";
import schemaRaw from "@/assets/sparvconfig.schema.json";

export const schema = schemaRaw as unknown as JSONSchema7;

export const uiSchema: UiSchema = {
  metadata: {
    id: { "ui:disabled": true },
    description: { additionalProperties: { "ui:widget": "textarea" } },
    short_description: { additionalProperties: { "ui:widget": "textarea" } },
  },
};

export function loadSchema(te: VueI18n["te"], t: VueI18n["t"]) {
  const copy = cloneDeep(schema);
  transformSchema(copy, te, t);
  return copy;
}

/** Get list of ancestor property names */
export const getPropertyPath = (parts: string[]) =>
  parts.filter((value, index) => parts[index - 1] == "properties");

/** Set translated, human-readable titles and descriptions, and remove default values. */
export function transformSchema(
  schema: JSONSchema7,
  te: VueI18n["te"],
  t: VueI18n["t"],
) {
  schemaWalk(schema, undefined, (schema, path, parent, parentPath) => {
    if (typeof schema != "object") return;
    // For a property node, `path` will be `["properties", name]`
    if (path[0] != "properties") return;
    const name = path[1];

    // Construct path as string
    const pathStr = getPropertyPath([...parentPath, ...path]).join(".");

    // Build translation keys
    const titleKey = `config.schema.${pathStr}.title`;
    const descrKey = `config.schema.${pathStr}.description`;

    // Set field title from translation, or fall back to prettified field name
    schema.title = te(titleKey) ? t(titleKey) : prettyName(name);
    // Set field description from translation, if any
    if (te(descrKey)) schema.description = t(descrKey);
  });
}

/** Convert "foo_bar_baz" to "Foo bar baz" */
const prettyName = (name: string): string =>
  capitalize(name.replace(/_/g, " "));

/** Collect top-level peroperty names in schema */
export const getTopProperties = (schema: JSONSchema7) => {
  const names = new Set<string>();
  schemaWalk(schema, (node, path, parent, parentPath) =>
    names.add(getPropertyPath([...parentPath, ...path])[0]),
  );
  return [...names];
};

/** Which form parts belong on which pages */
export const formSections = [
  {
    key: "metadata",
    properties: ["metadata"],
  },
  {
    key: "import",
    properties: [
      "import",
      "xml_import",
      "docx_import",
      "odt_import",
      "pdf_import",
      "text_import",
      "xml_import",
    ],
  },
  {
    key: "annotations",
    properties: [
      "classes",
      "custom_annotations",
      "dateformat",
      "geo",
      "hist",
      "hunpos",
      "misc",
      "segment",
      "stanza",
      "sbx_freeling",
    ],
  },
  {
    key: "export",
    properties: [
      "export",
      "conll_export",
      "csv_export",
      "cwb",
      "korp",
      "passthrough",
      "stats_export",
      "xml_export",
    ],
  },
  {
    key: "process",
    properties: [
      "sparv",
      "threads",
      "parent",
      "install",
      "uninstall",
      "preload",
    ],
  },
];
