import { inject } from "vue";
import type { NewsService } from "./news.types";
import { DefaultNewsService } from "./DefaultNewsService";
import { injectionKeys } from "@/injection";

/** Global instance of the service */
let service: NewsService | undefined;

/** Provide the news service */
export function useNews() {
  if (!service)
    service = inject(injectionKeys.service.news, new DefaultNewsService());

  return service;
}
