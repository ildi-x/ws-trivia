export const HELP_BASE_URL = "https://help.wealthsimple.com";
export const HELP_CENTER_HOME_URL = `${HELP_BASE_URL}/hc/en-ca`;
export const PROMOTIONS_BASE_URL = "https://promotions.wealthsimple.com";

const ARTICLE_PATH_RE =
  /\/hc\/(en-ca|fr-ca)\/articles\/(\d+)(?:-([^/?#]+))?/;

export function getBaseUrl(url: string): string {
  try {
    if (new URL(url).hostname === "promotions.wealthsimple.com") {
      return PROMOTIONS_BASE_URL;
    }
  } catch {
    // fall through
  }
  return HELP_BASE_URL;
}

export function isPromotionsHost(url: string): boolean {
  return getBaseUrl(url) === PROMOTIONS_BASE_URL;
}

function parseArticlePath(url: string): { locale: string; id: string; slug?: string } | null {
  const baseUrl = getBaseUrl(url);
  const path = new URL(url, baseUrl).pathname.replace(/\.html$/, "").replace(/\/$/, "");
  const match = ARTICLE_PATH_RE.exec(path);
  if (!match?.[2]) return null;
  return { locale: match[1]!, id: match[2], slug: match[3] };
}

/** Stable DB key; promotions articles are prefixed to avoid ID collisions across Zendesk instances. */
export function extractArticleId(url: string): string | null {
  const parsed = parseArticlePath(url);
  if (!parsed) return null;
  return isPromotionsHost(url) ? `promo-${parsed.id}` : parsed.id;
}

export function normalizeArticleUrl(url: string, locale = "en-ca"): string | null {
  const parsed = parseArticlePath(url);
  if (!parsed) return null;

  const baseUrl = getBaseUrl(url);
  const base = `${baseUrl}/hc/${locale}/articles/${parsed.id}`;
  return parsed.slug ? `${base}-${parsed.slug}` : base;
}

export function toAbsoluteUrl(href: string, pageUrl: string): string {
  try {
    return new URL(href, getBaseUrl(pageUrl)).href.split("#")[0]!;
  } catch {
    return href;
  }
}

export function isEnCaArticleUrl(url: string): boolean {
  return /\/hc\/en-ca\/articles\/\d+/.test(url);
}

/** @deprecated Use HELP_BASE_URL */
export const BASE_URL = HELP_BASE_URL;
