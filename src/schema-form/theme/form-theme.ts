import React from "react";
import { applyPureVueInReact } from "veaury";
import type { ThemeProps } from "@rjsf/core";
import type {
  FieldProps,
  IconButtonProps,
  RegistryFieldsType,
} from "@rjsf/utils";
import AddButtonVue from "./AddButton.vue";

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

const AddButton = applyPureVueInReact(
  AddButtonVue,
) as React.ComponentType<IconButtonProps>;

const templates = {
  ButtonTemplates: {
    AddButton,
  },
};

const theme: ThemeProps = {
  fields,
  templates,
};
export default theme;
