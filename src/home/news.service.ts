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
 * @returns News items considered interesting for users
 * @throws Fetch or parse errors
 */
export async function fetchNews(): Promise<NewsItem[]> {
  const items = await fetchAllNews();
  return items.filter((item) => !item.expires || item.expires > new Date());
}

/**
 * Fetch news and select *featured* recent items
 *
 * @returns News items that the user really should see
 * @throws Fetch or parse errors
 */
export async function fetchFeaturedNews(): Promise<NewsItem[]> {
  return (await fetchNews()).filter((item) => item.tags?.includes("featured"));
}
