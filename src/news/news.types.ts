import type { ByLang } from "@/util.types";

/** Interface for a service that provides news about the app */
export type NewsService = {
  /** Load news items to show on home page. */
  loadLatestNews: () => Promise<NewsItem[]>;
  /** Load high-priority news items to show on top of the page. */
  loadFeaturedNews: () => Promise<NewsItem[]>;
};

/** A news item */
export type NewsItem = {
  title: ByLang | string;
  body: ByLang | string;
  created: Date;
};
