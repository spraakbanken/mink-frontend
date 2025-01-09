import { defaultConfig } from "@formkit/vue";
import { en, sv } from "@formkit/i18n";
export { plugin as formkit } from "@formkit/vue";
import type { FormKitNode, FormKitExtendableSchemaRoot } from "@formkit/core";

// Configure FormKit
export const formkitConfig = defaultConfig({
  locales: { en, sv },
  plugins: [addAsteriskPlugin],
  rules: { onlyif },
});

/** A Formkit plugin that adds a red asterisk to required fields. */
function addAsteriskPlugin(node: FormKitNode) {
  node.on("created", () => {
    if (!node.props.definition) return;
    const isCheckboxOrRadio = ["checkbox", "radio"].includes(node.props.type);
    const isMultiple = node.props.options;
    const propName = isCheckboxOrRadio && isMultiple ? "legend" : "label";
    if (node.props.definition.schemaMemoKey)
      node.props.definition.schemaMemoKey += `_asterisk_${propName}`;

    const asterisk = {
      $el: "span",
      if: "$state.required",
      attrs: { class: "mx-1 text-red-600 font-bold" },
      children: ["*"],
    };

    // Wrap and replace the schema function to decorate the schema with an asterisk span element if the field is required
    const schemaFn = node.props.definition
      .schema as FormKitExtendableSchemaRoot;
    node.props.definition.schema = (sectionsSchema = {}) => {
      sectionsSchema[propName] = { children: ["$label", asterisk] };
      return schemaFn(sectionsSchema);
    };
  });
}

/** Validation rule to require that all or none of a group of fields are set. */
function onlyif(node: FormKitNode, othersComma: string) {
  const parent = node.at("$parent") as FormKitNode<Record<string, any>>;
  if (!parent?.value) {
    console.error("onlyif rule missing parent");
    return true;
  }

  for (const other of othersComma.split(",")) {
    if (other in parent.value && !!parent.value[other] != !!node.value)
      return false;
  }
  return true;
}

onlyif.skipEmpty = false;
