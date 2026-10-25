import { Link } from '@tanstack/react-router';
import { CALCULATORS } from '@/content/calculators';

export function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <title>Halaman tidak ditemukan · Kalkulator Zakat</title>
      <meta name="robots" content="noindex" />
      <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 text-ink-muted">Mungkin Anda sedang mencari salah satu kalkulator ini:</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {CALCULATORS.map((calculator) => (
          <li key={calculator.id}>
            <Link
              to={calculator.path}
              className="inline-block rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {calculator.navLabel}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
