import { useEffect, useRef, type ReactNode } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn, formatRupiah } from '@/lib/format';
import { AnimatedAmount } from './animated-amount';
import { PatternBackdrop } from '@/components/pattern-backdrop';
import { PendingValue } from '@/components/pending-value';

export type ResultStatus = 'empty' | 'wajib' | 'belum';

export interface ResultDetail {
  label: string;
  value: string;
  /** Nilai masih memakai harga emas bawaan; tampilkan sebagai skeleton. */
  pending?: boolean;
}

export interface ResultPanelProps {
  title: string;
  amount: number;
  status: ResultStatus;
  /** Kalimat status di bawah nominal. */
  message: string;
  /** 0..n, hanya untuk zakat yang bernisab. */
  nisabRatio?: number;
  details: ResultDetail[];
  actions?: ReactNode;
}

export function ResultPanel({
  title,
  amount,
  status,
  message,
  nisabRatio,
  details,
  actions,
}: ResultPanelProps) {
  const announcement = useDebouncedValue(
    status === 'empty' ? '' : `${title}: ${formatRupiah(amount)}. ${message}`,
    900
  );
  const progress = Math.min(1, nisabRatio ?? 0);
  const sectionRef = useRef<HTMLElement>(null);
  const previousStatus = useRef(status);

  // Sorotan singkat saat status berubah menjadi wajib zakat.
  useEffect(() => {
    const node = sectionRef.current;
    const becameWajib = status === 'wajib' && previousStatus.current !== 'wajib';
    previousStatus.current = status;
    if (!node || !becameWajib || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    node.animate(
      [
        {
          transform: 'scale(0.98)',
          boxShadow: '0 0 0 0 color-mix(in oklch, var(--gold) 55%, transparent)',
        },
        { transform: 'scale(1.01)', offset: 0.5 },
        { transform: 'scale(1)', boxShadow: '0 0 0 18px transparent' },
      ],
      { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }, [status]);

  return (
    <section
      ref={sectionRef}
      id="hasil"
      aria-labelledby="hasil-title"
      className={cn(
        'relative scroll-mt-24 overflow-hidden rounded-3xl border p-6 transition-colors sm:p-8',
        status === 'wajib'
          ? 'border-transparent bg-primary text-on-primary'
          : 'border-line bg-surface text-ink'
      )}
    >
      <PatternBackdrop className="text-current" />
      <div className="relative space-y-6">
        <div className="space-y-2">
          <h2
            id="hasil-title"
            className={cn(
              'text-sm font-semibold tracking-wide uppercase',
              status === 'wajib' ? 'text-on-primary/90' : 'text-ink-muted'
            )}
          >
            {title}
          </h2>
          <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <AnimatedAmount value={amount} className="tabular" />
          </p>
          <p className={status === 'wajib' ? 'text-on-primary/90' : 'text-ink-muted'}>{message}</p>
        </div>

        {nisabRatio !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Terhadap nisab</span>
              <span className="tabular">{Math.round((nisabRatio || 0) * 100)}%</span>
            </div>
            <div
              className={cn(
                'h-2.5 overflow-hidden rounded-full',
                status === 'wajib' ? 'bg-on-primary/20' : 'bg-surface-muted'
              )}
              role="progressbar"
              aria-label="Persentase terhadap nisab"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="h-full origin-left rounded-full bg-gold transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        )}

        {details.length > 0 && (
          <dl
            className={cn(
              'grid gap-3 border-t pt-5 text-sm',
              status === 'wajib' ? 'border-on-primary/20' : 'border-line'
            )}
          >
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between gap-4">
                <dt className={status === 'wajib' ? 'text-on-primary/90' : 'text-ink-muted'}>
                  {detail.label}
                </dt>
                <dd className="tabular text-right font-semibold">
                  <PendingValue pending={Boolean(detail.pending)}>{detail.value}</PendingValue>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {actions}
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

export function MobileResultBar({ title, amount }: { title: string; amount: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-muted">{title}</p>
          <p className="text-xl font-extrabold">
            <AnimatedAmount value={amount} className="tabular" />
          </p>
        </div>
        <a
          href="#hasil"
          className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary"
        >
          Lihat detail
        </a>
      </div>
    </div>
  );
}
