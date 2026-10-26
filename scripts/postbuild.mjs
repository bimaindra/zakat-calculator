// Runs after `vite build`: writes sitemap.xml, robots.txt and Cloudflare _headers
// (strict CSP with hashes of the inline scripts TanStack Start emits).
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve('dist/client');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://zakat.bimaindra.com').replace(/\/$/, '');
const EXCLUDED_FROM_SITEMAP = new Set(['/404']);

const GOLD_PRICE_ORIGINS = ['https://latest.currency-api.pages.dev', 'https://cdn.jsdelivr.net'];

async function findHtmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const toRoute = (file) => {
  const relative = path
    .relative(OUT_DIR, file)
    .replace(/\\/g, '/')
    .replace(/\.html$/, '');
  if (relative === 'index') return '/';
  return `/${relative.replace(/\/index$/, '')}`;
};

/** sha256 of every executable inline <script> (JSON-LD is data, not script). */
function inlineScriptHashes(html) {
  const hashes = [];
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || /application\/ld\+json/.test(attrs) || !body) continue;
    hashes.push(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  return hashes;
}

/**
 * Cloudflare serves 404.html for any unknown URL (not_found_handling: "404-page"). Hydrating it there would mismatch the
 * prerendered /404 route, so ship it as plain static HTML without the app bundle.
 */
async function makeNotFoundStatic() {
  const file = path.join(OUT_DIR, '404.html');
  const html = await readFile(file, 'utf8');
  const stripped = html
    .replace(/<script data-tsr-stream-part[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<script type="module"[^>]*><\/script>/g, '')
    .replace(/<link rel="modulepreload"[^>]*\/?>/g, '');
  await writeFile(file, stripped);
}

await makeNotFoundStatic();
const files = await findHtmlFiles(OUT_DIR);
const routes = files.map(toRoute).sort();
const scriptHashes = new Set();
for (const file of files) {
  inlineScriptHashes(await readFile(file, 'utf8')).forEach((hash) => scriptHashes.add(hash));
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((route) => !EXCLUDED_FROM_SITEMAP.has(route))
  .map(
    (route) =>
      `  <url><loc>${SITE_URL}${route}</loc><lastmod>${lastmod}</lastmod><priority>${route === '/' ? '1.0' : '0.8'}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scriptHashes].sort().join(' ')}`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' ${GOLD_PRICE_ORIGINS.join(' ')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

// Cloudflare ignores _headers lines longer than 2,000 characters; fail loudly instead.
const MAX_HEADER_LINE = 2000;
const tooLong = headers.split('\n').find((line) => line.length > MAX_HEADER_LINE);
if (tooLong) {
  throw new Error(`_headers line exceeds ${MAX_HEADER_LINE} chars: ${tooLong.slice(0, 80)}…`);
}

await writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
await writeFile(path.join(OUT_DIR, 'robots.txt'), robots);
await writeFile(path.join(OUT_DIR, '_headers'), headers);
console.log(
  `[postbuild] sitemap.xml (${routes.length - EXCLUDED_FROM_SITEMAP.size} pages), robots.txt, _headers (${scriptHashes.size} script hashes)`
);
