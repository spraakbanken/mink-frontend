import { defaultConfig } from "@formkit/vue";
export { plugin as formkit } from "@formkit/vue";

export const formkitConfig = defaultConfig({
  plugins: [addAsteriskPlugin],
});

const isCheckboxAndRadioMultiple = (node) =>
  (node.props.type === "checkbox" || node.props.type === "radio") &&
  node.props.options;

function addAsteriskPlugin(node) {
  const asteriskEl = {
    $el: "span",
    attrs: {
      class: "mx-1 text-red-600 font-bold",
    },
    children: ["*"],
  };
  node.on("created", () => {
    const schemaFn = node.props.definition.schema;
    node.props.definition.schema = (sectionsSchema = {}) => {
      const isRequired = node.props.parsedRules.some(
        (rule) => rule.name === "required"
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
      return schemaFn(sectionsSchema);
    };
  });
}
