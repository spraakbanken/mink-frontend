import {
  defineAsyncComponent,
  inject,
  type Component,
  type InjectionKey,
} from "vue";

/** Load a component which can be overridden by instance config. */
export function overridableComponent(
  injectionKey: InjectionKey<Component>,
  importDefault: () => Promise<Component>,
): Component {
  return defineAsyncComponent(
    async () => await (inject(injectionKey) || importDefault()),
  );
}

export const injectionKeys = {
  component: {
    MinkLogo: Symbol() as InjectionKey<Component>,
  },
};
