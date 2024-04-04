import { defaultConfig } from "@formkit/vue";
import { en, sv } from "@formkit/i18n";
export { plugin as formkit } from "@formkit/vue";
import type { FormKitNode, FormKitExtendableSchemaRoot } from "@formkit/core";

// Configure FormKit
export const formkitConfig = defaultConfig({
  plugins: [addAsteriskPlugin],
  locales: { en, sv },
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
