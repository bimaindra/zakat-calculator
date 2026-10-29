import { useRef, useState, type FormEvent } from 'react';
import { useGoldPrice } from '@/context/gold-price-context';
import { formatDate, formatRupiah } from '@/lib/format';
import type { GoldPriceSource } from '@/lib/gold-price';
import { PendingValue } from '@/components/pending-value';
import { CurrencyField } from './currency-field';

const SOURCE_LABEL: Record<GoldPriceSource, string> = {
  live: 'harga pasar',
  cache: 'harga pasar tersimpan',
  default: 'harga bawaan',
  manual: 'harga manual Anda',
};

export function GoldPriceBadge() {
  const { price, marketPrice, isLoading, isPricePending, setManualPrice } = useGoldPrice();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(price.pricePerGram);

  const open = () => {
    setDraft(price.pricePerGram);
    dialogRef.current?.showModal();
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (draft > 0) setManualPrice(draft);
    dialogRef.current?.close();
  };

  const reset = () => {
    setManualPrice(null);
    dialogRef.current?.close();
  };

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-gold-soft px-4 py-3 text-sm"
        aria-busy={isPricePending}
      >
        <span aria-hidden="true">✦</span>
        <span>
          Harga emas{' '}
          <strong className="tabular font-bold">
            <PendingValue pending={isPricePending}>
              {formatRupiah(price.pricePerGram)}/g
            </PendingValue>
          </strong>
        </span>
        <span className="text-ink-muted">
          {isPricePending ? (
            '· memuat harga terkini…'
          ) : (
            <>
              · {SOURCE_LABEL[price.source]}
              {price.source !== 'manual' && `, ${formatDate(price.date)}`}
            </>
          )}
        </span>
        <button
          type="button"
          onClick={open}
          className="ml-auto rounded-md font-semibold text-gold-ink underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          Ubah
        </button>
      </div>
      {price.source === 'default' && !isLoading && (
        <p role="alert" className="mt-2 text-sm text-danger">
          Harga emas terkini gagal dimuat. Perhitungan memakai harga bawaan per{' '}
          {formatDate(price.date)}; ubah bila perlu.
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="gold-dialog-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={save} className="space-y-5 p-6">
          <div className="space-y-1">
            <h2 id="gold-dialog-title" className="text-lg font-bold">
              Ubah harga emas
            </h2>
            <p className="text-sm text-ink-muted">
              Misalnya harga emas Antam hari ini.{' '}
              {isLoading ? (
                'Harga acuan otomatis sedang dimuat.'
              ) : (
                <>
                  Harga acuan ({SOURCE_LABEL[marketPrice.source]}){' '}
                  {formatRupiah(marketPrice.pricePerGram)}/g ({formatDate(marketPrice.date)}).
                </>
              )}
            </p>
          </div>
          <CurrencyField label="Harga emas per gram" value={draft} onChange={setDraft} />
          <div className="flex flex-wrap justify-end gap-2">
            {price.source === 'manual' && (
              <button
                type="button"
                onClick={reset}
                className="mr-auto rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-muted hover:text-ink"
              >
                Pakai harga acuan otomatis
              </button>
            )}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={draft <= 0}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
