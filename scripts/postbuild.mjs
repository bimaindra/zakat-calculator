// Runs after `vite build`: writes sitemap.xml and robots.txt into the static output.
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve('dist/client');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://zakat.bimaindra.com').replace(/\/$/, '');

async function findPages(dir, base = '') {
  const pages = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      pages.push(...(await findPages(path.join(dir, entry.name), `${base}/${entry.name}`)));
    } else if (entry.name === 'index.html') {
      pages.push(base || '/');
    }
  }
  return pages;
}

const pages = (await findPages(OUT_DIR)).sort();
const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url><loc>${SITE_URL}${page}</loc><lastmod>${lastmod}</lastmod><priority>${page === '/' ? '1.0' : '0.8'}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
await writeFile(path.join(OUT_DIR, 'robots.txt'), robots);
console.log(`[postbuild] sitemap.xml (${pages.length} pages), robots.txt`);
