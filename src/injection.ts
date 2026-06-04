import {
  defineAsyncComponent,
  inject,
  type Component,
  type InjectionKey,
} from "vue";
import type { AppConfig } from "./app/config.types";
import type { AnalysisRegistryService } from "./analyses/analyses.types";
import type { NewsService } from "./news/news.types";

export const injectionKeys = {
  config: Symbol() as InjectionKey<AppConfig>,
  component: {
    AppFooter: Symbol() as InjectionKey<() => Promise<Component>>,
    HomeIntro: Symbol() as InjectionKey<() => Promise<Component>>,
    HomeSecondary: Symbol() as InjectionKey<() => Promise<Component>>,
    LabIndicator: Symbol() as InjectionKey<() => Promise<Component>>,
    MinkLogo: Symbol() as InjectionKey<() => Promise<Component>>,
  },
  service: {
    analysisRegistry: Symbol() as InjectionKey<AnalysisRegistryService>,
    news: Symbol() as InjectionKey<NewsService>,
  },
};

/** Load a component which can be overridden by instance config */
export function injectComponent(
  key: keyof typeof injectionKeys.component,
  importDefault: () => Promise<Component>,
): Component {
  return defineAsyncComponent(
    inject(injectionKeys.component[key], importDefault),
  );
}
