import { Link, createFileRoute } from '@tanstack/react-router';
import { GoldPriceBadge } from '@/components/calculator/gold-price-badge';
import { useGoldPrice } from '@/context/gold-price-context';
import { CALCULATORS, type CalculatorId } from '@/content/calculators';
import { formatRupiah } from '@/lib/format';
import { DEFAULT_RICE_PRICE_PER_KG, FITRAH_RICE_KG, monthlyNisab, yearlyNisab } from '@/lib/zakat';
import { PatternBackdrop } from '@/components/pattern-backdrop';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { price } = useGoldPrice();

  const keyFigure: Record<CalculatorId, { label: string; value: string }> = {
    profesi: { label: 'Nisab per bulan', value: formatRupiah(monthlyNisab(price.pricePerGram)) },
    maal: { label: 'Nisab per tahun', value: formatRupiah(yearlyNisab(price.pricePerGram)) },
    fitrah: {
      label: 'Per jiwa, mulai',
      value: formatRupiah(FITRAH_RICE_KG * DEFAULT_RICE_PRICE_PER_KG),
    },
    perdagangan: { label: 'Nisab per tahun', value: formatRupiah(yearlyNisab(price.pricePerGram)) },
  };

  return (
    <main id="main">
      <section className="relative overflow-hidden">
        <PatternBackdrop fade="radial" className="text-primary" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-sm font-semibold text-gold-ink">
            Nisab mengikuti harga emas terkini
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Kalkulator Zakat Online <span className="text-primary">2026</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-ink-muted sm:text-xl">
            Hitung zakat profesi, maal, fitrah, dan perdagangan dalam hitungan detik. Gratis, tanpa
            daftar, dan data Anda tidak pernah meninggalkan perangkat.
          </p>
          <div className="mt-8 max-w-xl">
            <GoldPriceBadge />
          </div>
        </div>
      </section>

      <section aria-labelledby="pilih-zakat" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="pilih-zakat" className="sr-only">
          Pilih jenis zakat
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {CALCULATORS.map((calculator) => (
            <li key={calculator.id}>
              <Link
                to={calculator.path}
                className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 sm:p-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Kalkulator {calculator.navLabel}
                    <span
                      className="ml-2 inline-block text-primary transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </h3>
                  <p className="text-ink-muted">{calculator.summary}</p>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4 text-sm">
                  <span className="text-ink-muted">{keyFigure[calculator.id].label}</span>
                  <span className="tabular font-bold">{keyFigure[calculator.id].value}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
