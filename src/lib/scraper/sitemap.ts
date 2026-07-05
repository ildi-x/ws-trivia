import { XMLParser } from "fast-xml-parser";
import {
  extractArticleId,
  HELP_BASE_URL,
  isEnCaArticleUrl,
  PROMOTIONS_BASE_URL,
} from "./url";

export type SitemapEntry = {
  url: string;
  externalId: string;
  lastmod: Date | null;
};

export const HELP_SITEMAP_URL = `${HELP_BASE_URL}/hc/sitemap.xml`;
export const PROMOTIONS_SITEMAP_URL = `${PROMOTIONS_BASE_URL}/hc/sitemap.xml`;

export async function fetchSitemapFromUrl(sitemapUrl: string): Promise<SitemapEntry[]> {
  const response = await fetch(sitemapUrl, {
    headers: {
      "User-Agent": "WealthsimpleTriviaBot/1.0 (+https://github.com/ws-trivia)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as {
    urlset?: {
      url?: Array<{ loc?: string; lastmod?: string }> | { loc?: string; lastmod?: string };
    };
  };

  const urls = parsed.urlset?.url;
  const entries = Array.isArray(urls) ? urls : urls ? [urls] : [];

  const byId = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    const loc = entry.loc?.trim();
    if (!loc || !isEnCaArticleUrl(loc)) continue;

    const externalId = extractArticleId(loc);
    if (!externalId) continue;

    const lastmod = entry.lastmod ? new Date(entry.lastmod) : null;
    const existing = byId.get(externalId);

    if (!existing || (lastmod && (!existing.lastmod || lastmod > existing.lastmod))) {
      byId.set(externalId, { url: loc, externalId, lastmod });
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.url.localeCompare(b.url));
}

export async function fetchAllSitemapEntries(): Promise<SitemapEntry[]> {
  const [helpEntries, promotionsEntries] = await Promise.all([
    fetchSitemapFromUrl(HELP_SITEMAP_URL),
    fetchSitemapFromUrl(PROMOTIONS_SITEMAP_URL),
  ]);

  const byId = new Map<string, SitemapEntry>();

  for (const entry of [...helpEntries, ...promotionsEntries]) {
    const existing = byId.get(entry.externalId);
    if (!existing || (entry.lastmod && (!existing.lastmod || entry.lastmod > existing.lastmod))) {
      byId.set(entry.externalId, entry);
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.url.localeCompare(b.url));
}

/** Fetches articles from help.wealthsimple.com and promotions.wealthsimple.com. */
export async function fetchSitemapEntries(): Promise<SitemapEntry[]> {
  return fetchAllSitemapEntries();
}
