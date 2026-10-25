import { Link } from '@tanstack/react-router';
import { CALCULATORS } from '@/content/calculators';

export function CalculatorTabs() {
  return (
    <nav aria-label="Jenis zakat" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="inline-flex min-w-full gap-1 rounded-2xl border border-line bg-surface p-1 sm:min-w-0">
        {CALCULATORS.map((calculator) => (
          <li key={calculator.id} className="flex-1 sm:flex-none">
            <Link
              to={calculator.path}
              resetScroll={false}
              className="block rounded-xl px-4 py-2.5 text-center text-sm font-semibold whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
              activeProps={{
                className: 'bg-primary !text-on-primary shadow-sm',
                'aria-current': 'page',
              }}
            >
              <span className="sm:hidden">{calculator.tabLabel}</span>
              <span className="hidden sm:inline">{calculator.navLabel}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
