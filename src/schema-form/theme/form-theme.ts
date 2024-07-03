import React from "react";
import { applyPureVueInReact } from "veaury";
import type { FormProps, ThemeProps } from "@rjsf/core";
import type { IconButtonProps } from "@rjsf/utils";
import type { Component } from "vue";
import AddButtonVue from "./AddButton.vue";
import RemoveButtonVue from "./RemoveButton.vue";
import MoveUpButtonVue from "./MoveUpButton.vue";
import MoveDownButtonVue from "./MoveDownButton.vue";

// Rename and retype the Veaury converter to allow specifying return type better.
const toReact = <P = {}>(component: Component) =>
  applyPureVueInReact(component) as React.ComponentType<P>;

const templates: FormProps["templates"] = {
  ButtonTemplates: {
    AddButton: toReact<IconButtonProps>(AddButtonVue),
    RemoveButton: toReact<IconButtonProps>(RemoveButtonVue),
    MoveUpButton: toReact<IconButtonProps>(MoveUpButtonVue),
    MoveDownButton: toReact<IconButtonProps>(MoveDownButtonVue),
  },
};

const theme: ThemeProps = {
  templates,
};
export default theme;
