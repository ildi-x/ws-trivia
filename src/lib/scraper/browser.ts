import { chromium, type Browser, type BrowserContext } from "playwright";

let browser: Browser | null = null;
let context: BrowserContext | null = null;

async function getContext(): Promise<BrowserContext> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }

  if (!context) {
    context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      locale: "en-CA",
    });
  }

  return context;
}

export async function fetchPageHtml(url: string, retries = 3): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const ctx = await getContext();
      const page = await ctx.newPage();

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForSelector("h1.article-title, .article-body", {
          timeout: 30000,
        });

        const html = await page.content();
        return html;
      } finally {
        await page.close();
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      await sleep(delay);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

export async function closeBrowser(): Promise<void> {
  if (context) {
    await context.close();
    context = null;
  }

  if (browser) {
    await browser.close();
    browser = null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
