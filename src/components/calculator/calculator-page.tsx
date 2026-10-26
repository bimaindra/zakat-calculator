import type { ReactNode } from 'react';
import { useGoldPrice } from '@/context/gold-price-context';
import type { CalculatorInfo } from '@/content/calculators';
import { CalculatorTabs } from './calculator-tabs';
import { HistoryList } from './history-list';
import { ResultActions } from './result-actions';
import { GoldPriceBadge } from './gold-price-badge';
import { MobileResultBar, ResultPanel, type ResultPanelProps } from './result-panel';
import { PatternBackdrop } from '@/components/pattern-backdrop';
import { ZakatIconTile } from '@/components/zakat-icon';

interface CalculatorPageProps {
  calculator: CalculatorInfo;
  heading: string;
  lead: string;
  fields: ReactNode;
  result: Omit<ResultPanelProps, 'actions' | 'pending'>;
  /** Awal teks berbagi, mis. "Zakat profesiku bulan ini" (lanjut nominal). */
  shareLabel: string;
  children?: ReactNode;
}

export function CalculatorPage({
  calculator,
  heading,
  lead,
  fields,
  result,
  shareLabel,
  children,
}: CalculatorPageProps) {
  const { isPricePending } = useGoldPrice();
  // Selama harga emas belum final, status wajib/belum masih dihitung dari harga bawaan.
  const pending = calculator.usesGoldPrice && isPricePending;

  return (
    <main id="main" className="pb-28 lg:pb-0">
      <div className="relative overflow-hidden">
        <PatternBackdrop fade="bottom" className="text-primary" />
        <div className="relative mx-auto max-w-6xl space-y-6 px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
          <CalculatorTabs />
          <div className="max-w-2xl space-y-3">
            <ZakatIconTile
              type={calculator.id}
              className="size-14 rounded-2xl"
              iconClassName="size-8"
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {heading}
            </h1>
            <p className="text-lg text-pretty text-ink-muted">{lead}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_26rem] lg:gap-10">
        {/* Badge berisi <dialog><form>, jadi harus di luar form kalkulator (form tidak boleh bersarang). */}
        <div className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          {calculator.usesGoldPrice && <GoldPriceBadge />}
          <form
            className="space-y-6"
            onSubmit={(event) => event.preventDefault()}
            aria-label={`Formulir ${heading.toLowerCase()}`}
          >
            {fields}
          </form>
        </div>
        <div className="space-y-6 lg:sticky lg:top-24">
          <ResultPanel
            {...result}
            pending={pending}
            actions={
              !pending && result.status === 'wajib' && result.amount > 0 ? (
                <ResultActions
                  type={calculator.id}
                  amount={result.amount}
                  shareLabel={shareLabel}
                  path={calculator.path}
                />
              ) : null
            }
          />
          <HistoryList />
        </div>
      </div>

      {children}

      {result.status !== 'empty' && (
        <MobileResultBar title={result.title} amount={result.amount} pending={pending} />
      )}
    </main>
  );
}
