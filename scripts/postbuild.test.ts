import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';

it('uses the built canonical URL for sitemap and robots even when the shell environment differs', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'zakat-postbuild-'));
  try {
    const out = path.join(dir, 'dist/client');
    mkdirSync(out, { recursive: true });
    writeFileSync(
      path.join(out, 'index.html'),
      '<link rel="canonical" href="https://example.test/"/>'
    );
    writeFileSync(path.join(out, '404.html'), '<html>Not found</html>');
    execFileSync(process.execPath, [path.resolve('scripts/postbuild.mjs')], {
      cwd: dir,
      env: { ...process.env, VITE_SITE_URL: 'https://wrong.test' },
    });
    expect(readFileSync(path.join(out, 'sitemap.xml'), 'utf8')).toContain(
      '<loc>https://example.test/</loc>'
    );
    expect(readFileSync(path.join(out, 'robots.txt'), 'utf8')).toContain(
      'https://example.test/sitemap.xml'
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
