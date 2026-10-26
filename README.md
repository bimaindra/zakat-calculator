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
scripts/postbuild.mjs  sitemap.xml, robots.txt and Cloudflare _headers (CSP with inline script hashes)
wrangler.jsonc       Cloudflare Workers static assets config
public/og/           1200×630 social images
docs/                learning notes
```

## How it works

- **Calculations** live in `src/lib/zakat.ts` as pure functions: nisab is 85 g gold (profesi uses 1/12 per month), the rate is 2.5%, and fitrah is 2.5 kg of rice per person.
- **Gold price** comes from [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (XAU→IDR). If that fails it tries the jsDelivr mirror, then a 12-hour `localStorage` cache, then a built-in default. Users can set a manual price, e.g. Antam's.
- **Privacy**: no backend, no analytics. History stores only type, amount and timestamp in `localStorage`. Shared text includes only the zakat amount.

## Deployment (Cloudflare Workers)

The site is deployed as [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) with no Worker script. `wrangler.jsonc` serves `dist/client`:

- `zakat-maal.html` is served at `/zakat-maal`. `/zakat-maal.html` and `/zakat-maal/` redirect there (`html_handling: "auto-trailing-slash"`).
- Unknown URLs get `404.html` with a 404 status (`not_found_handling: "404-page"`).
- `_headers` (generated on every build, because the CSP hashes change whenever the inline scripts change) adds the security headers and caches `/assets/*` as immutable.

| Script         | What it does                                                           |
| -------------- | ---------------------------------------------------------------------- |
| `pnpm preview` | Serve `dist/client` locally with Cloudflare's runtime (`wrangler dev`) |
| `pnpm deploy`  | Build and deploy with `wrangler deploy` (needs `wrangler login`)       |

Or connect the GitHub repo in **Workers & Pages → Create → Import a repository** (Workers Builds) with:

- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`
- Node version comes from `.node-version` (24).

Set `VITE_SITE_URL` (build variable) to change the domain used for canonical URLs, OG tags and the sitemap. It defaults to `https://zakat.bimaindra.com`.

After the first deploy:

1. Add `zakat.bimaindra.com` under the Worker's **Settings → Domains & Routes → Custom domain**. If `bimaindra.com` already uses Cloudflare DNS, the record and certificate are created automatically.
2. Keep **Rocket Loader**, **Email Address Obfuscation** and automatic **Web Analytics** injection **off** for this hostname. They inject inline scripts that the CSP will (correctly) block.
3. Add the property in Google Search Console and submit `https://zakat.bimaindra.com/sitemap.xml`.

## Maintenance

- `DEFAULT_GOLD_PRICE` in `src/lib/gold-price.ts` is only a fallback. Bump it occasionally.
- `DEFAULT_RICE_PRICE_PER_KG` in `src/lib/zakat.ts` should follow BAZNAS' yearly zakat fitrah decision.
- Page titles use the build year, so rebuild at least once a year.
- Content in `src/content/articles.ts` is a draft and must be reviewed for fiqh accuracy before publishing.
