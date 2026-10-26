# TanStack Start notes (as used in this project)

A guided tour of the TanStack Start concepts this app relies on, with pointers to the files that use them. Read alongside the git history: each commit on `revamp/2026` introduces roughly one idea.

Official docs: https://tanstack.com/start/latest/docs/framework/react/overview

## 1. Build setup: `vite.config.ts`

Start is a Vite plugin. Order matters: `tanstackStart()` must come **before** `@vitejs/plugin-react`.

```ts
tanstackStart({ prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: false } });
```

- `enabled` renders every discovered route to static HTML at build time.
- `crawlLinks` follows `<a href>` in rendered pages to find more routes.
- `autoSubfolderIndex: false` writes `zakat-maal.html` instead of `zakat-maal/index.html`, so Cloudflare serves `/zakat-maal` without redirecting to `/zakat-maal/`.

The build outputs `dist/client` (static site, what we deploy) and `dist/server` (used only during prerendering).

Docs: [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)

## 2. The router: `src/router.tsx`

`getRouter()` creates the router from the generated route tree. Start calls it on the server (prerender) and on the client (hydration).

`defaultPreload: 'intent'` preloads a route's code when the user hovers or focuses a link, which is why switching calculator tabs feels instant.

`defaultViewTransition: true` wraps every client-side navigation in `document.startViewTransition()`. The browser snapshots the old page, React renders the new one, and the two snapshots animate via `::view-transition-old(root)` / `::view-transition-new(root)` in `src/styles/app.css`. Elements with their own `view-transition-name` (the header and the calculator tabs) are captured separately, so they stay put while the content fades. Browsers without the API just navigate instantly. A single `<Link viewTransition>` can opt in per link instead.

Docs: [View transitions](https://tanstack.com/router/latest/docs/framework/react/api/router/RouterOptionsType#defaultviewtransition-property)

## 3. File-based routes: `src/routes/`

| File                                            | URL                 |
| ----------------------------------------------- | ------------------- |
| `__root.tsx`                                    | wraps every page    |
| `index.tsx`                                     | `/`                 |
| `zakat-profesi.tsx` (and the other calculators) | `/zakat-profesi`    |
| `404.tsx`                                       | `/404` → `404.html` |

The plugin generates `src/routeTree.gen.ts` (committed, never edited by hand). It also powers type-safe links: `<Link to="/zakat-maal">` is checked at compile time. Try typing a wrong path and run `pnpm type-check`. When we first added calculator links before their routes existed, TypeScript caught it.

Docs: [File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)

## 4. The root document: `src/routes/__root.tsx`

Unlike a Vite SPA there is no `index.html`. The root route renders the whole `<html>`:

- `<HeadContent />` outputs everything returned by each matched route's `head()`.
- `<Scripts />` outputs the hydration scripts.
- `head().scripts` injects the inline theme script that runs before paint (no dark-mode flash).
- `notFoundComponent` handles unknown URLs during client-side navigation.

## 5. Per-route `head()`: SEO

Each route returns its own metadata:

```ts
export const Route = createFileRoute('/zakat-maal')({
  head: () => calculatorHead('maal'),
  component: MaalPage,
});
```

`src/lib/seo.ts` builds title, description, canonical, Open Graph/Twitter tags and JSON-LD. Child route tags override the root's (e.g. `title`). Because of prerendering, all of this is in the static HTML that Google fetches.

Docs: [Document head management](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management)

## 6. Prerendering vs. client state

During the build each page renders **once on the server** with default state:

- the gold price is `DEFAULT_GOLD_PRICE`
- calculator inputs are `0`
- `localStorage` is not available

In the browser, React **hydrates** that HTML, then effects run: `GoldPriceProvider` fetches the live price, and the history hook reads `localStorage` through `useSyncExternalStore` (whose server snapshot is an empty list). Rule of thumb: anything that touches `window`, `localStorage` or `fetch` belongs in an effect or an external-store subscription, never in render.

## 7. Things we deliberately did not use

- **Loaders and server functions** (`createServerFn`): there is no server at runtime, so all data is either static or fetched in the browser.
- **SSR on Cloudflare Workers**: unnecessary for five static pages. If that ever changes, see the [Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for running it on Cloudflare Workers. For now `wrangler.jsonc` only serves static assets.

## 8. Gotchas we hit

- `verbatimModuleSyntax` must stay off (per the Start docs) or server-only code can leak into client bundles.
- Start emits inline scripts (hydration data, scroll restoration). A strict CSP therefore needs their hashes; `scripts/postbuild.mjs` computes them after every build.
- Cloudflare serves `404.html` for any unknown path (`not_found_handling: "404-page"`), but its prerendered router state says `/404`. Hydrating it under a different URL broke rendering, so postbuild strips the app bundle from `404.html` and it ships as plain HTML.
