import type { ThemeProps } from "@rjsf/core";
import type { FieldProps, RegistryFieldsType } from "@rjsf/utils";
import React from "react";

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

const theme: ThemeProps = { fields };
export default theme;
