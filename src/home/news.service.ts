const Yaml = import("js-yaml").then((m) => m.default);
import once from "lodash/once";
import { retry } from "@/util";
import type { ByLang } from "@/util.types";

const NEWS_URL: string = import.meta.env.VITE_NEWS_URL;

/** A news item in the Newsdesk repo */
export type NewsItem = {
  title: ByLang | string;
  body: ByLang | string;
  created: Date;
  expires?: Date;
  tags?: NewsTag[];
};

/** News item tags recognized by this frontend */
type NewsTag = "featured" | string;

/**
 * Fetch and parse a YAML newsfeed
 *
 * @returns All items
 * @throws Fetch or parse errors
 */
export const fetchAllNews = once(async (): Promise<NewsItem[]> => {
  if (!NEWS_URL) return [];
  const response = await retry(() => fetch(NEWS_URL));
  const yaml = await response.text();
  return (await Yaml).load(yaml) as NewsItem[];
});

/**
 * Fetch news and select recent items
 *
 * @param filterFeatured If true, select items having the "featured" tag;
 *   if false, select items *not* having the "featured" tag;
 *   if undefined, select all recent items.
 * @returns Recent news items
 * @throws Fetch or parse errors
 */
export async function fetchNews(filterFeatured?: boolean): Promise<NewsItem[]> {
  // Get news and skip items that have expired
  // TODO Also skip items older than 6 months
  let items = (await fetchAllNews()).filter(
    (item) => !item.expires || item.expires > new Date(),
  );

  // Filter by the "featured" tag if specified
  if (filterFeatured != null)
    items = items.filter(
      (item) => !!item.tags?.includes("featured") == filterFeatured,
    );

  return items;
}
