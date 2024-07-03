import React from "react";
import { applyPureVueInReact } from "veaury";
import type { FormProps, ThemeProps } from "@rjsf/core";
import type {
  FieldProps,
  IconButtonProps,
  RegistryFieldsType,
} from "@rjsf/utils";
import type { Component } from "vue";
import AddButtonVue from "./AddButton.vue";
import RemoveButtonVue from "./RemoveButton.vue";
import MoveUpButtonVue from "./MoveUpButton.vue";
import MoveDownButtonVue from "./MoveDownButton.vue";

// Rename and retype the Veaury converter to allow specifying return type better.
const toReact = <P = {}>(component: Component) =>
  applyPureVueInReact(component) as React.ComponentType<P>;

class MyField extends React.Component<FieldProps> {
  constructor(props: FieldProps) {
    super(props);
    this.state = props.formData;
  }

  render() {
    return React.createElement(
      "div",
      {},
      `This is a MyField (${JSON.stringify(this.state)})`,
    );
  }
}

const fields: RegistryFieldsType = { BooleanField: MyField };

const templates: FormProps["templates"] = {
  ButtonTemplates: {
    AddButton: toReact<IconButtonProps>(AddButtonVue),
    RemoveButton: toReact<IconButtonProps>(RemoveButtonVue),
    MoveUpButton: toReact<IconButtonProps>(MoveUpButtonVue),
    MoveDownButton: toReact<IconButtonProps>(MoveDownButtonVue),
  },
};

const theme: ThemeProps = {
  fields,
  templates,
};
export default theme;
