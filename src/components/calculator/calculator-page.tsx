import type { ReactNode } from 'react';
import { CalculatorTabs } from './calculator-tabs';
import { GoldPriceBadge } from './gold-price-badge';
import { MobileResultBar, ResultPanel, type ResultPanelProps } from './result-panel';
import { PatternBackdrop } from '@/components/pattern-backdrop';

interface CalculatorPageProps {
  heading: string;
  lead: string;
  /** Sembunyikan harga emas untuk zakat yang tidak memakai nisab emas (fitrah). */
  usesGoldPrice?: boolean;
  fields: ReactNode;
  result: ResultPanelProps;
  children?: ReactNode;
}

export function CalculatorPage({
  heading,
  lead,
  usesGoldPrice = true,
  fields,
  result,
  children,
}: CalculatorPageProps) {
  return (
    <main id="main" className="pb-28 lg:pb-0">
      <div className="relative overflow-hidden">
        <PatternBackdrop fade="bottom" className="text-primary" />
        <div className="relative mx-auto max-w-6xl space-y-6 px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
          <CalculatorTabs />
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {heading}
            </h1>
            <p className="text-lg text-pretty text-ink-muted">{lead}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_26rem] lg:gap-10">
        <form
          className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8"
          onSubmit={(event) => event.preventDefault()}
          aria-label={`Formulir ${heading.toLowerCase()}`}
        >
          {usesGoldPrice && <GoldPriceBadge />}
          {fields}
        </form>
        <div className="lg:sticky lg:top-24">
          <ResultPanel {...result} />
        </div>
      </div>

      {children}

      <MobileResultBar title={result.title} amount={result.amount} />
    </main>
  );
}
