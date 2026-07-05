import * as cheerio from "cheerio";
import { htmlToMarkdown } from "./markdown";
import {
  extractArticleId,
  HELP_BASE_URL,
  isPromotionsHost,
  normalizeArticleUrl,
  PROMOTIONS_BASE_URL,
  toAbsoluteUrl,
} from "./url";

export type ParsedArticle = {
  externalId: string;
  title: string;
  url: string;
  category: string;
  section: string | null;
  rawHtml: string;
  markdown: string;
  links: string[];
  lastModified: Date | null;
};

const PROMOTIONS_QUIZ_CATEGORIES = new Set(["Promotions", "Referrals"]);

function resolveCategory(url: string, category: string, section: string | null): string {
  if (!isPromotionsHost(url)) return category;
  if (section && PROMOTIONS_QUIZ_CATEGORIES.has(section)) return section;
  return section ?? category;
}

export function parseArticleHtml(html: string, url: string): ParsedArticle {
  const $ = cheerio.load(html);
  const externalId = extractArticleId(url);

  if (!externalId) {
    throw new Error(`Could not extract article ID from URL: ${url}`);
  }

  const title = $("h1.article-title").first().text().trim();
  if (!title) {
    throw new Error(`Missing title for article: ${url}`);
  }

  const breadcrumbCategory =
    $("ol.breadcrumbs li:nth-child(2) a").first().text().trim() || "Uncategorized";
  const sectionText = $("ol.breadcrumbs li:nth-child(3) a").first().text().trim();
  const section = sectionText || null;
  const category = resolveCategory(url, breadcrumbCategory, section);

  const lastModifiedRaw = $(".article-updated-at-date time[datetime]").first().attr("datetime");
  const lastModified = lastModifiedRaw ? new Date(lastModifiedRaw) : null;

  const body = $(".article-body").first().clone();
  body.find(".callout, .article-votes, script, style").remove();
  const rawHtml = body.html()?.trim() ?? "";

  if (!rawHtml) {
    throw new Error(`Missing article body for: ${url}`);
  }

  const links = new Set<string>();
  body.find("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const absolute = toAbsoluteUrl(href, url);
    const normalized = normalizeArticleUrl(absolute);
    if (normalized) links.add(normalized);
    else if (
      absolute.startsWith(HELP_BASE_URL) ||
      absolute.startsWith(PROMOTIONS_BASE_URL)
    ) {
      links.add(absolute);
    }
  });

  return {
    externalId,
    title,
    url: normalizeArticleUrl(url) ?? url,
    category,
    section,
    rawHtml,
    markdown: htmlToMarkdown(rawHtml),
    links: Array.from(links),
    lastModified,
  };
}
