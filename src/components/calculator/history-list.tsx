import { Link } from '@tanstack/react-router';
import { useHistory } from '@/hooks/use-history';
import { ZakatIconTile } from '@/components/zakat-icon';
import { getCalculator } from '@/content/calculators';
import { formatRupiah } from '@/lib/format';

const dateTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

export function HistoryList() {
  const { entries, clear } = useHistory();
  if (entries.length === 0) return null;

  return (
    <section
      aria-labelledby="riwayat-title"
      className="rounded-3xl border border-line bg-surface p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="riwayat-title" className="font-bold">
          Riwayat perhitungan
        </h2>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-semibold text-ink-muted hover:text-danger"
        >
          Hapus semua
        </button>
      </div>
      <ul className="divide-y divide-line">
        {entries.map((entry) => {
          const calculator = getCalculator(entry.type);
          return (
            <li key={entry.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <ZakatIconTile
                  type={entry.type}
                  className="size-9 rounded-xl"
                  iconClassName="size-5"
                />
                <div>
                  <Link to={calculator.path} className="font-semibold hover:text-primary">
                    {calculator.navLabel}
                  </Link>
                  <p className="text-ink-muted">{dateTime.format(new Date(entry.createdAt))}</p>
                </div>
              </div>
              <span className="tabular font-bold">{formatRupiah(entry.amount)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">
        Tersimpan hanya di perangkat ini, tidak dikirim ke mana pun.
      </p>
    </section>
  );
}
