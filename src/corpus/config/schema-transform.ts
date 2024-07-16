import type { JSONSchema7 } from "json-schema";
import { schemaWalk, type Visitor } from "@cloudflare/json-schema-walker";
import { useI18n } from "vue-i18n";
import capitalize from "lodash/capitalize";
import useLocale from "@/i18n/locale.composable";

const getPropertyPath = (parts: string[]) =>
  parts.filter((value, index) => parts[index - 1] == "properties");

/** Convert "foo_bar_baz" to "Foo bar baz" */
const prettyName = (name: string): string =>
  capitalize(name.replace(/_/g, " "));

export function useTransformSchema() {
  const { t } = useI18n();
  const { te } = useLocale();

  /** Set translated, human-readable titles and descriptions. */
  function transformSchema(schema: JSONSchema7) {
    schemaWalk(schema, undefined, postFunc);
  }

  /** Callback for massaging each schema node. */
  const postFunc: Visitor = (schema, path, parent, parentPath) => {
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
  };

  return { transformSchema };
}
