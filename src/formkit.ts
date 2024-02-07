import { defaultConfig } from "@formkit/vue";
import { en, sv } from "@formkit/i18n";
export { plugin as formkit } from "@formkit/vue";
import type { FormKitNode, FormKitExtendableSchemaRoot } from "@formkit/core";

export const formkitConfig = defaultConfig({
  plugins: [addAsteriskPlugin],
  locales: { en, sv },
});

const isCheckboxAndRadioMultiple = (node: FormKitNode) =>
  (node.props.type === "checkbox" || node.props.type === "radio") &&
  node.props.options;

function addAsteriskPlugin(node: FormKitNode) {
  const asteriskEl = {
    $el: "span",
    attrs: {
      class: "mx-1 text-red-600 font-bold",
    },
    children: ["*"],
  };
  node.on("created", () => {
    if (!node.props.definition) return;
    const schemaFn = node.props.definition.schema;
    node.props.definition.schema = (sectionsSchema = {}) => {
      const isRequired = node.props.parsedRules.some(
        (rule: any) => rule.name === "required",
      );

      if (isRequired) {
        if (isCheckboxAndRadioMultiple(node)) {
          sectionsSchema.legend = {
            children: ["$label", asteriskEl],
          };
        } else {
          sectionsSchema.label = {
            children: ["$label", asteriskEl],
          };
        }
      }
      return (schemaFn as FormKitExtendableSchemaRoot)(sectionsSchema);
    };
  });
}
