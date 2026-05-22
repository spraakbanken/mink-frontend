import type { NewsService } from "./news.types";

/** Default implementation of the news service, with no news */
export class DefaultNewsService implements NewsService {
  loadLatestNews = () => Promise.resolve([]);
  loadFeaturedNews = () => Promise.resolve([]);
}
