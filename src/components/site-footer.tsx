import { Link } from '@tanstack/react-router';
import { AUTHOR } from '@/config/site';
import { CALCULATORS } from '@/content/calculators';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-muted/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6">
        <div className="space-y-3">
          <p className="font-bold">Kalkulator Zakat</p>
          <p className="max-w-sm text-sm text-ink-muted">
            Hasil perhitungan bersifat perkiraan. Untuk kepastian, konsultasikan dengan amil atau
            lembaga zakat resmi seperti BAZNAS.
          </p>
        </div>
        <nav aria-label="Kalkulator" className="sm:justify-self-end">
          <ul className="grid gap-2 text-sm">
            {CALCULATORS.map((calculator) => (
              <li key={calculator.path}>
                <Link
                  to={calculator.path}
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  {calculator.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          © {new Date().getFullYear()}{' '}
          <a href={AUTHOR.url} className="underline-offset-2 hover:underline">
            {AUTHOR.name}
          </a>
          . Harga emas dari{' '}
          <a
            href="https://github.com/fawazahmed0/exchange-api"
            className="underline-offset-2 hover:underline"
            rel="noopener"
          >
            fawazahmed0/exchange-api
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
