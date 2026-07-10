# WS Trivia

Interactive trivia built from real Wealthsimple Help Center content.

Live at [ws-trivia-hydf7.ondigitalocean.app](https://ws-trivia-hydf7.ondigitalocean.app/).

## Features

- **Pick a quiz** — choose a Help Center category or play across all topics
- **Real content** — every question is grounded in official Wealthsimple documentation
- **Learn as you play** — each answer links back to the source article
- **Category coverage** — investing, taxes, spending, transfers, promotions, referrals, and more
- **Admin pipeline** — scrape articles, extract facts, generate questions, and publish to the quiz
- **Per-category stats** — track articles, facts, and published questions by Help Center topic
- **Built from the Help Center** — content pulled from help.wealthsimple.com and promotions.wealthsimple.com

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [PostgreSQL](https://www.postgresql.org) + [Prisma 7](https://www.prisma.io)
- [OpenAI](https://openai.com) for fact extraction and question generation
- [Playwright](https://playwright.dev) for Help Center scraping
- [Tailwind CSS 4](https://tailwindcss.com)
