# Kalkulator Zakat

Free zakat calculator for Indonesia: **profesi, maal, fitrah and perdagangan**. Nisab follows the live gold price, results update as you type, and nothing the user enters ever leaves their device.

Live: https://zakat.bimaindra.com

## Stack

- [TanStack Start](https://tanstack.com/start) with static prerendering (every route ships as full HTML for SEO)
- React 19 + React Compiler, TypeScript, Vite 8
- Tailwind CSS v4, Plus Jakarta Sans (self-hosted), [motion](https://motion.dev)
- Vitest for the calculation, gold price, history and SEO helpers

## Getting started

Requires Node 24+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script           | What it does                                                            |
| ---------------- | ----------------------------------------------------------------------- |
| `pnpm build`     | Prerender all routes to `dist/client`, then run `scripts/postbuild.mjs` |
| `pnpm test`      | Run unit tests                                                          |
| `pnpm check-all` | Type-check, lint, format check and tests                                |

To check the production output locally, serve `dist/client` with any static file server.

## Project layout

```
src/
  routes/            file-based routes (/, /zakat-profesi, /zakat-maal, /zakat-fitrah, /zakat-perdagangan, /404)
  components/        UI (calculator/, calculators/, article/)
  content/           calculator registry, SEO copy, FAQ and references
  context/           gold price provider
  lib/               framework-free logic: zakat.ts, gold-price.ts, history.ts, seo.ts, format.ts
scripts/postbuild.mjs  sitemap.xml, robots.txt and Netlify _headers (CSP with inline script hashes)
public/og/           1200×630 social images
docs/                learning notes
```

## How it works

- **Calculations** live in `src/lib/zakat.ts` as pure functions: nisab is 85 g gold (profesi uses 1/12 per month), the rate is 2.5%, and fitrah is 2.5 kg of rice per person.
- **Gold price** comes from [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (XAU→IDR). If that fails it tries the jsDelivr mirror, then a 12-hour `localStorage` cache, then a built-in default. Users can set a manual price, e.g. Antam's.
- **Privacy**: no backend, no analytics. History stores only type, amount and timestamp in `localStorage`. Shared text includes only the zakat amount.

## Deployment (Netlify)

`netlify.toml` builds with `pnpm build` and publishes `dist/client`. Security headers are generated into `dist/client/_headers` on every build, because the CSP hashes change whenever the inline scripts change.

Set `VITE_SITE_URL` to change the canonical domain used for canonical URLs, OG tags and the sitemap. It defaults to `https://zakat.bimaindra.com`.

After the first deploy:

1. Point the `zakat` CNAME at the Netlify site and enable HTTPS.
2. Add the property in Google Search Console and submit `https://zakat.bimaindra.com/sitemap.xml`.

## Maintenance

- `DEFAULT_GOLD_PRICE` in `src/lib/gold-price.ts` is only a fallback. Bump it occasionally.
- `DEFAULT_RICE_PRICE_PER_KG` in `src/lib/zakat.ts` should follow BAZNAS' yearly zakat fitrah decision.
- Page titles use the build year, so rebuild at least once a year.
- Content in `src/content/articles.ts` is a draft and must be reviewed for fiqh accuracy before publishing.
