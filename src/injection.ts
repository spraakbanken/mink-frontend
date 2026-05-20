import {
  defineAsyncComponent,
  inject,
  type Component,
  type InjectionKey,
} from "vue";
import type { AppConfig } from "./app/config.types";
import type { AnalysisRegistryService } from "./analyses/analyses.types";

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
  config: Symbol() as InjectionKey<AppConfig>,
  component: {
    MinkLogo: Symbol() as InjectionKey<Component>,
  },
  service: {
    analysisRegistry: Symbol() as InjectionKey<AnalysisRegistryService>,
  },
};
